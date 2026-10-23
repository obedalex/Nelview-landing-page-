// ============================================================
//  NELVIEW — Intake router: Beta signups + Demo requests
//  Runs from: thenelverse@gmail.com
//  Sends FROM: hello@nelview.com  (verified "Send mail as" alias)
//  Team copy TO: team@nelview.com
//
//  Beta signups / applications  -> the spreadsheet this script is bound to
//                                  (sheet tab "Applications")
//  Demo requests                -> a separate spreadsheet, by ID below
//                                  (sheet tab "Demo Requests")
//  Both flows email the submitter a branded confirmation and alert the team.
// ============================================================

var FROM_ALIAS    = 'hello@nelview.com';   // submitter confirmation sender (verified alias)
var TEAM_INBOX    = 'team@nelview.com,nelviewai@gmail.com';     // internal alert recipients (comma-separated)

// Demo requests are stored here (separate from the beta sheet):
// https://docs.google.com/spreadsheets/d/1hI6IfF67mXrSj81O3pBqUP9No3AXz4h4lAsVp8H0VB8/edit
var DEMO_SHEET_ID = '1hI6IfF67mXrSj81O3pBqUP9No3AXz4h4lAsVp8H0VB8';

// ---- Routing helper ---------------------------------------------------------
function isDemoRequest(data) {
  return (data && data.stage || '').toLowerCase().indexOf('demo') > -1;
}

// ---- Security helpers -------------------------------------------------------
var MAX_LEN = 4000;        // cap any single field to blunt abuse / oversized payloads
var HONEYPOT_FIELDS = ['company_website', 'hp', 'website', 'url2'];

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Escape user-supplied text before it is placed inside an HTML email body.
// Prevents injected links / images / markup from rendering in inboxes (phishing).
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Neutralise spreadsheet formula injection: a leading = + - @ (or tab/CR) makes
// Sheets evaluate the cell, so e.g. =HYPERLINK("evil") could phish whoever opens
// the sheet. Prefix such values with an apostrophe so they stay literal text.
function cell(v) {
  var s = String(v == null ? '' : v);
  if (s.length > MAX_LEN) s = s.slice(0, MAX_LEN);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

// One-line plain-text value for an email Subject (no newlines / header injection).
function subjPart(v) {
  return String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, 160);
}

// Cap every incoming string field and strip control characters.
function sanitizeInput(data) {
  var clean = {};
  Object.keys(data || {}).forEach(function (k) {
    var v = data[k];
    if (typeof v === 'string') {
      clean[k] = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, MAX_LEN);
    } else {
      clean[k] = v;
    }
  });
  return clean;
}

var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// ---- Waitlist columns + lookups --------------------------------------------
var BETA_COLS = ['submitted_at','stage','name','email','country','role',
                 'institution','fields','reviews','supervises','working_on','heard','referred_by',
                 'position','reference','ref_code'];

// Make sure the header row has every column (adds new ones to older sheets).
function betaSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Applications') || ss.insertSheet('Applications');
  if (sheet.getLastRow() === 0) { sheet.appendRow(BETA_COLS); return sheet; }
  var head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  BETA_COLS.forEach(function (c) {
    if (head.indexOf(c) === -1) { head.push(c); sheet.getRange(1, head.length).setValue(c); }
  });
  return sheet;
}
function headIdx(sheet) {
  var head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0], m = {};
  head.forEach(function (h, i) { m[h] = i; });
  return m;
}
function allRows(sheet) {
  var n = sheet.getLastRow() - 1;
  return n > 0 ? sheet.getRange(2, 1, n, sheet.getLastColumn()).getValues() : [];
}
// Reference: NV-BETA- + 6 digits from the row position, salted so it isn't guessable in order.
function makeReference(position) {
  var h = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'nv-beta-' + position + '-' + Date.now());
  var n = 0; for (var i = 0; i < 4; i++) n = (n * 256 + (h[i] & 255)) % 1000000;
  return 'NV-BETA-' + ('000000' + n).slice(-6);
}
// Short share code from the first name + 4 chars, e.g. "ama7k2q".
function makeRefCode(name, taken) {
  var base = String(name || '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '').slice(0, 10) || 'friend';
  var abc = 'abcdefghjkmnpqrstuvwxyz23456789', code;
  do { code = base; for (var i = 0; i < 4; i++) code += abc.charAt(Math.floor(Math.random() * abc.length)); } while (taken[code]);
  return code;
}
// Live place in line: sign-up order, moved up 3 places per successful referral.
function liveStanding(rows, H, rowIndex) {
  var codes = {}, refs = {};
  rows.forEach(function (r) { var c = String(r[H.ref_code] || ''); if (c) codes[c] = 1; });
  rows.forEach(function (r) { var by = String(r[H.referred_by] || '').toLowerCase(); if (by && codes[by]) refs[by] = (refs[by] || 0) + 1; });
  var me = rows[rowIndex], myCode = String(me[H.ref_code] || ''), myRefs = refs[myCode] || 0;
  var base = rowIndex + 1, place = Math.max(1, base - 3 * myRefs);
  return { position: place, joined_as: base, referrals: myRefs, total: rows.length };
}
function findByEmail(rows, H, email) {
  email = String(email || '').trim().toLowerCase();
  for (var i = 0; i < rows.length; i++) if (String(rows[i][H.email] || '').trim().toLowerCase() === email) return i;
  return -1;
}
function standingFor(sheet, i) {
  var H = headIdx(sheet), rows = allRows(sheet), s = liveStanding(rows, H, i);
  s.ok = true; s.reference = rows[i][H.reference]; s.ref_code = rows[i][H.ref_code]; s.count = rows.length;
  return s;
}

// ---- Public reads (beta waitlist) ------------------------------------------
//  GET            -> { count }
//  GET ?ref=CODE  -> live standing for that applicant (no personal data returned)
function doGet(e) {
  try {
    var sheet = betaSheet(), H = headIdx(sheet), rows = allRows(sheet);
    var code = e && e.parameter && String(e.parameter.ref || '').toLowerCase();
    if (code) {
      for (var i = 0; i < rows.length; i++) if (String(rows[i][H.ref_code] || '').toLowerCase() === code) return jsonOut(standingFor(sheet, i));
      return jsonOut({ ok: false, error: 'not found', count: rows.length });
    }
    return jsonOut({ count: rows.length });
  } catch (err) {
    return jsonOut({ count: 0 });
  }
}

// ---- Intake -----------------------------------------------------------------
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);

    // Bot trap: real users never fill the hidden honeypot field. If it's set,
    // accept silently (so bots get no signal) but store / email nothing.
    for (var i = 0; i < HONEYPOT_FIELDS.length; i++) {
      if (data && data[HONEYPOT_FIELDS[i]]) return jsonOut({ ok: true });
    }

    data = sanitizeInput(data);

    // Require a syntactically valid email before doing anything.
    if (!data.email || !EMAIL_RE.test(data.email)) {
      return jsonOut({ ok: false, error: 'invalid email' });
    }

    var st = String(data.stage || '').toLowerCase();
    if (isDemoRequest(data)) { handleDemo(data); return jsonOut({ ok: true }); }
    if (st.indexOf('newsletter') > -1 || st.indexOf('pledge') > -1 || st.indexOf('alert') > -1) return jsonOut(handleSubscriber(data));
    if (st.indexOf('expert') > -1) return jsonOut(handleExpert(data));
    if (st.indexOf('contact') > -1) return jsonOut(handleContact(data));
    return jsonOut(handleBeta(data));
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---- Beta signups / applications -------------------------------------------
function handleBeta(data) {
  var sheet = betaSheet(), H = headIdx(sheet), rows = allRows(sheet);

  // Same email again? Return their existing place + reference instead of a duplicate row.
  var existing = findByEmail(rows, H, data.email);
  if (existing > -1) { var s = standingFor(sheet, existing); s.returning = true; return s; }

  var taken = {}; rows.forEach(function (r) { taken[String(r[H.ref_code] || '')] = 1; });
  var position = rows.length + 1;
  data.position = position;
  data.reference = makeReference(position);
  data.ref_code = makeRefCode(data.name, taken);
  data.referred_by = String(data.referred_by || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);

  var width = sheet.getLastColumn(), row = new Array(width).fill('');
  Object.keys(H).forEach(function (k) { row[H[k]] = cell(data[k] || ''); });
  row[H.position] = position;
  sheet.appendRow(row);
  SpreadsheetApp.flush();

  // 1) Branded confirmation to the applicant (from hello@nelview.com)
  if (EMAIL_RE.test(data.email)) {
    sendConfirmation(data);
  }
  // 2) Internal alert to the team
  notifyTeam(data);

  return standingFor(sheet, position - 1);
}

// ---- Generic tab writer (adds any missing columns) ---------------------------
function writeRow(tabName, cols, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
  if (sheet.getLastRow() === 0) sheet.appendRow(cols);
  var head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  cols.forEach(function (c) { if (head.indexOf(c) === -1) { head.push(c); sheet.getRange(1, head.length).setValue(c); } });
  // also keep any extra fields the form sent (so nothing is silently dropped)
  Object.keys(data).forEach(function (k) { if (k !== 'hp' && head.indexOf(k) === -1) { head.push(k); sheet.getRange(1, head.length).setValue(k); } });
  var row = head.map(function (h) { return cell(data[h] || ''); });
  sheet.appendRow(row);
  return sheet;
}

// ---- Newsletter + Research Pledge alerts -> tab "Subscribers" ---------------
function handleSubscriber(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Subscribers');
  if (sheet && sheet.getLastRow() > 1) {
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    var head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var ei = head.indexOf('email'), li = head.indexOf('stage'), em = String(data.email).toLowerCase();
    for (var i = 0; i < rows.length; i++) if (String(rows[i][ei]).toLowerCase() === em && String(rows[i][li]) === String(data.stage)) return { ok: true, duplicate: true };
  }
  writeRow('Subscribers', ['submitted_at', 'stage', 'email', 'page', 'lang'], data);
  sendTeamAlert(data, { email: 'Email', stage: 'List', page: 'Page' }, 'New subscriber', 'New Nelview subscriber');
  return { ok: true };
}

// ---- Expert reviewer applications -> tab "Expert Applications" --------------
function handleExpert(data) {
  writeRow('Expert Applications', ['submitted_at', 'stage', 'name', 'email', 'title', 'institution', 'country', 'role', 'fields', 'docs', 'methods', 'orcid', 'scholar', 'degree', 'years', 'reviews', 'journals', 'rate', 'capacity', 'pay', 'note', 'cv_file', 'page'], data);
  sendBranded(data.email, 'We received your Nelview reviewer application', brandedEmail({
    tag: 'Reviewer network', badge: 'Application received',
    heading: 'Thanks, ' + esc(String(data.name || 'there').trim().split(' ')[0]) + '.<br>Your application is in.',
    paras: ['We verify every reviewer before they see a brief. Here\'s what happens next.'],
    steps: [['1', 'Application received', 'We\'ve got your details.'], ['2', 'Credential verification', 'ORCID, affiliation, publication record and identity, usually 5\u20137 days.'], ['3', 'You start bidding', 'We\'ll email you when your profile is live.']],
    ctaText: 'Learn about the reviewer network', ctaHref: 'https://www.nelview.com/experts',
    footer: 'You\'re receiving this because you applied to review for Nelview.'
  }));
  var labels = {}; ['name', 'email', 'institution', 'country', 'fields', 'orcid', 'degree', 'years', 'reviews', 'rate', 'cv_file'].forEach(function (k) { labels[k] = k.replace('_', ' '); });
  sendTeamAlert(data, labels, 'New expert', 'New Nelview expert application');
  return { ok: true };
}

// ---- General contact (questions, partnerships, press) -> tab "Contact" -------
function handleContact(data) {
  writeRow('Contact', ['submitted_at', 'stage', 'topic', 'name', 'email', 'institution', 'message', 'page'], data);
  sendBranded(data.email, 'We received your message', brandedEmail({
    tag: 'Contact', badge: 'Message received',
    heading: 'Thanks, ' + esc(String(data.name || 'there').trim().split(' ')[0]) + '.<br>We\'ll be in touch.',
    paras: ['A real person on the Nelview team reads every message. We usually reply within 1\u20132 working days.'],
    steps: [['1', 'Message received', 'We\'ve got it: ' + esc(data.topic || 'General question') + '.'], ['2', 'We route it', 'To the right person on our team.'], ['3', 'We reply', 'By email, usually within 1\u20132 working days.']],
    ctaText: 'Explore Nelview', ctaHref: 'https://www.nelview.com',
    footer: 'You\'re receiving this because you contacted Nelview at nelview.com.'
  }));
  sendTeamAlert(data, { topic: 'Topic', name: 'Name', email: 'Email', institution: 'Organisation', message: 'Message' }, 'New message', 'New Nelview contact message');
  return { ok: true };
}

// ---- Institution self-serve signups (portal — connect at launch) ------------
function handleInstitution(data) {
  writeRow('Institution Signups', ['submitted_at', 'stage', 'institution', 'org_type', 'country', 'domain', 'register', 'name', 'role', 'email', 'phone', 'plan', 'workspace', 'checks', 'page'], data);
  sendTeamAlert(data, { institution: 'Institution', country: 'Country', name: 'Admin', role: 'Title', email: 'Email', plan: 'Plan', workspace: 'Workspace', checks: 'Checks' }, 'New institution', 'New Nelview institution signup');
  return { ok: true };
}

// ---- Demo requests ----------------------------------------------------------
function handleDemo(data) {
  var ss = SpreadsheetApp.openById(DEMO_SHEET_ID);
  var sheet = ss.getSheetByName('Demo Requests') || ss.insertSheet('Demo Requests');
  var cols = ['submitted_at','stage','name','email','institution','role','team_size','message'];
  if (sheet.getLastRow() === 0) sheet.appendRow(cols);
  sheet.appendRow(cols.map(function (c) { return cell(data[c] || ''); }));

  // 1) Branded confirmation to the requester (from hello@nelview.com)
  if (EMAIL_RE.test(data.email)) {
    sendDemoConfirmation(data);
  }
  // 2) Internal alert to the team
  notifyTeamDemo(data);
}

// ---- Submitter confirmations ------------------------------------------------
function sendConfirmation(data) {
  var firstName = esc((data.name || '').trim().split(' ')[0] || 'there');
  sendBranded(data.email, "You're on the Nelview beta list \u2014 #" + data.position, betaConfirmationHtml(firstName, data));
}

function sendDemoConfirmation(data) {
  var firstName = esc((data.name || '').trim().split(' ')[0] || 'there');
  sendBranded(data.email, 'We received your Nelview demo request', demoConfirmationHtml(firstName));
}

function sendBranded(to, subject, html) {
  var opts = { htmlBody: html, name: 'Nelview', replyTo: FROM_ALIAS };
  // use the verified alias if present on this account; otherwise fall back to the account address
  var aliases = GmailApp.getAliases();
  if (aliases.indexOf(FROM_ALIAS) !== -1) opts.from = FROM_ALIAS;
  GmailApp.sendEmail(to, subject, '', opts);
}

// ---- Email shell (shared, light/dark aware) --------------------------------
function emailMeta() {
  return '<html><head><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">' +
    '<style>' +
    'body,#wrap{background:#ffffff!important;color:#111314!important;}' +
    '#wrap{border-color:#e3e8e5!important;}' +
    '#hd{background:#f6faf8!important;border-bottom-color:#dde8e2!important;}' +
    '#brand-name{color:#111314!important;}' +
    '#body-cell{background:#ffffff!important;}' +
    '#footer-cell{background:#f6faf8!important;border-top-color:#dde8e2!important;color:#6b7178!important;}' +
    '#steps-table{background:#f0f5f2!important;border-color:#dde8e2!important;}' +
    '.step-row td{border-bottom-color:#dde8e2!important;}' +
    '.body-txt{color:#4a5568!important;}' +
    '.step-sub{color:#6b7178!important;}' +
    '.step-title{color:#111314!important;}' +
    '.sig-txt{color:#4a5568!important;}' +
    '.sig-name{color:#111314!important;}' +
    '@media(prefers-color-scheme:dark){' +
    'body,#wrap{background:#0A0B0C!important;color:#F4F5F6!important;}' +
    '#wrap{border-color:#232629!important;}' +
    '#hd{background:#0A0B0C!important;border-bottom-color:#1c1f22!important;}' +
    '#brand-name{color:#F4F5F6!important;}' +
    '#body-cell{background:#0A0B0C!important;}' +
    '#footer-cell{background:#070809!important;border-top-color:#1c1f22!important;color:#6B7178!important;}' +
    '#steps-table{background:#111315!important;border-color:#232629!important;}' +
    '.step-row td{border-bottom-color:#1c1f22!important;}' +
    '.body-txt{color:#A7ADB4!important;}' +
    '.step-sub{color:#6B7178!important;}' +
    '.step-title{color:#F4F5F6!important;}' +
    '.sig-txt{color:#A7ADB4!important;}' +
    '.sig-name{color:#F4F5F6!important;}' +
    '}' +
    '</style></head><body style="margin:0;padding:20px;background:#ffffff;font-family:Helvetica,Arial,sans-serif;">';
}

// opts: { tag, badge, heading, paras:[..], steps:[[n,title,sub]..], ctaText, ctaHref, footer }
function brandedEmail(opts) {
  var stepsHtml = '';
  for (var i = 0; i < opts.steps.length; i++) {
    var s = opts.steps[i];
    stepsHtml += _stepLight(s[0], s[1], s[2], i < opts.steps.length - 1);
  }
  var parasHtml = '';
  for (var j = 0; j < opts.paras.length; j++) {
    var last = j === opts.paras.length - 1;
    parasHtml += '<p class="body-txt" style="font-size:15px;line-height:1.68;color:#4a5568;margin:0 0 ' +
      (last ? '26px' : '14px') + ';">' + opts.paras[j] + '</p>';
  }

  var content =
  '<table id="wrap" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e8e5;border-radius:20px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;">' +
    '<tr><td id="hd" style="padding:28px 40px;background:#f6faf8;border-bottom:1px solid #dde8e2;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>' +
        '<td><span id="brand-name" style="font-weight:700;font-size:21px;letter-spacing:-.02em;color:#111314;">Nel<span style="color:#1BB35C;">view</span></span></td>' +
        '<td align="right" style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#1BB35C;font-weight:600;">' + opts.tag + '</td>' +
      '</tr></table>' +
    '</td></tr>' +

    '<tr><td id="body-cell" style="padding:36px 40px 0;background:#ffffff;">' +
      '<div style="display:inline-block;background:rgba(27,179,92,0.12);border:1px solid rgba(27,179,92,0.35);color:#0e9e4a;font-size:12px;font-weight:600;padding:5px 13px;border-radius:999px;margin-bottom:18px;">&#10003; ' + opts.badge + '</div>' +
      '<h1 style="font-weight:700;font-size:27px;line-height:1.16;color:#111314;margin:0 0 18px;">' + opts.heading + '</h1>' +
      parasHtml +
    '</td></tr>' +

    '<tr><td style="padding:0 40px;background:#ffffff;">' +
      '<table id="steps-table" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f0f5f2;border:1px solid #dde8e2;border-radius:14px;">' +
        stepsHtml +
      '</table>' +
    '</td></tr>' +

    '<tr><td style="padding:28px 40px 0;background:#ffffff;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:10px;background:#1BB35C;">' +
        '<a href="' + opts.ctaHref + '" style="display:inline-block;font-weight:600;font-size:14px;color:#04140b;text-decoration:none;padding:13px 24px;">' + opts.ctaText + ' &#8594;</a>' +
      '</td></tr></table>' +
    '</td></tr>' +

    '<tr><td style="padding:26px 40px 32px;background:#ffffff;">' +
      '<p class="sig-txt" style="font-size:14px;line-height:1.65;color:#4a5568;margin:0;">Questions? Just reply to this email; a real person reads it.<br><br>' +
      '<span class="sig-name" style="color:#111314;font-weight:600;">The Nelview team</span></p>' +
    '</td></tr>' +

    '<tr><td id="footer-cell" style="padding:20px 40px;background:#f6faf8;border-top:1px solid #dde8e2;font-size:12px;line-height:1.6;color:#6b7178;">' +
      'Your ultimate pre-submission audit.<br>' + opts.footer +
    '</td></tr>' +
  '</table></body></html>';

  return emailMeta() + content;
}

function betaConfirmationHtml(firstName, data) {
  data = data || {};
  return brandedEmail({
    tag: 'Private beta',
    badge: 'You\'re on the list',
    heading: 'Hi ' + firstName + ', welcome<br>to the Nelview beta.',
    paras: [
      'Thanks for signing up. You\'ll soon get the honest, rigorous review you\'d want from a great supervisor, on your <strong style="color:#111314;">manuscripts, grant proposals and theses</strong>, in minutes, not months.',
      'We\'re onboarding researchers in small batches. Here\'s where you stand.',
      '<strong style="color:#111314;">Place in line: #' + esc(data.position || '') + '</strong><br>Application reference: <strong style="color:#111314;font-family:Menlo,monospace;">' + esc(data.reference || '') + '</strong><br>Move up the list: share <a href="https://www.nelview.com/beta?ref=' + esc(data.ref_code || '') + '" style="color:#15803D;">nelview.com/beta?ref=' + esc(data.ref_code || '') + '</a>'
    ],
    steps: [
      ['1','Application received','We\'ve got your details. Nothing more to do right now.'],
      ['2','We prepare your workspace','Tuned to your field and the kind of work you submitted.'],
      ['3','You get the keys','We\'ll email your invite the moment your access is live.']
    ],
    ctaText: 'Explore what Nelview does',
    ctaHref: 'https://www.nelview.com',
    footer: 'You\'re receiving this because you signed up for the Nelview beta at nelview.com.'
  });
}

function demoConfirmationHtml(firstName) {
  return brandedEmail({
    tag: 'Demo request',
    badge: 'Request received',
    heading: 'Hi ' + firstName + ', your demo<br>request is in.',
    paras: [
      'Thanks for your interest in Nelview. We\'ll put together a <strong style="color:#111314;">live walkthrough built around your field and team</strong>, and show you exactly how Nelview reviews, formats and verifies real work.',
      'Our team will be in touch shortly. Here\'s what happens next.'
    ],
    steps: [
      ['1','Request received','We\'ve got your details. Nothing more to do right now.'],
      ['2','We tailor your walkthrough','Built around your field, team size and what you\'d like to see.'],
      ['3','We schedule your demo','We\'ll email you within 1\u20132 working days to find a time.']
    ],
    ctaText: 'Explore what Nelview does',
    ctaHref: 'https://www.nelview.com',
    footer: 'You\'re receiving this because you requested a Nelview demo at nelview.com.'
  });
}

function _stepLight(n, title, sub, border) {
  return '<tr class="step-row"><td style="padding:16px 20px;' + (border ? 'border-bottom:1px solid #dde8e2;' : '') + '">' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
      '<td style="width:28px;vertical-align:top;font-weight:700;color:#1BB35C;font-size:15px;">' + n + '</td>' +
      '<td><span class="step-title" style="font-size:14px;font-weight:600;color:#111314;display:block;">' + title + '</span>' +
        '<span class="step-sub" style="font-size:13px;color:#6b7178;line-height:1.45;">' + sub + '</span></td>' +
    '</tr></table></td></tr>';
}

// ---- Internal team alerts ---------------------------------------------------
function notifyTeam(data) {
  var labels = {
    name:'Name', email:'Email', country:'Country', role:'Role',
    institution:'Institution', fields:'Field(s)', reviews:'Wants reviewed',
    supervises:'Supervises students', working_on:'Working on', heard:'Heard via',
    position:'Place in line', reference:'Reference', referred_by:'Referred by'
  };
  var isFull = (data.stage || '').toLowerCase().indexOf('full') === 0 ||
               (data.stage || '').toLowerCase().indexOf('application') > -1;

  sendTeamAlert(
    data,
    labels,
    isFull ? 'New application' : 'New signup',
    (isFull ? 'New Nelview application' : 'New Nelview signup')
  );
}

function notifyTeamDemo(data) {
  var labels = {
    name:'Name', email:'Email', institution:'Institution', role:'Role',
    team_size:'Team size', message:'What they\'d like to see'
  };
  sendTeamAlert(data, labels, 'New demo request', 'New Nelview demo request');
}

// ---- Test helpers (run these directly from the Apps Script editor) ---------
// Select the function in the toolbar dropdown and press Run.
// Writes a real row to the demo sheet and sends real emails.
function testDemo() {
  handleDemo({
    submitted_at: new Date().toISOString(),
    stage: 'Demo request',
    name: 'Freeman Philip',
    email: 'freemanphilip12@gmail.com',
    institution: 'University of Test',
    role: 'Researcher / academic',
    team_size: '2\u20135',
    message: 'This is a test demo request to confirm the sheet write and confirmation email work.'
  });
}

function testBeta() {
  handleBeta({
    submitted_at: new Date().toISOString(),
    stage: 'Email signup',
    name: 'Freeman Philip',
    email: 'freemanphilip12@gmail.com',
    country: 'Ghana',
    role: 'Researcher / academic',
    institution: 'University of Test',
    fields: 'Public Health',
    working_on: 'Test manuscript',
    heard: 'Test'
  });
}

function sendTeamAlert(data, labels, badge, subjectBase) {
  var rows = Object.keys(labels).map(function (k) {
    return '<tr>' +
      '<td style="padding:5px 14px 5px 0;color:#6B7178;font-size:13px;white-space:nowrap;vertical-align:top;">' + labels[k] + '</td>' +
      '<td style="padding:5px 0;color:#101314;font-size:13px;font-weight:600;">' + (data[k] ? esc(data[k]) : '&#8212;') + '</td>' +
    '</tr>';
  }).join('');

  var html =
    '<div style="font-family:Helvetica,Arial,sans-serif;max-width:540px;">' +
      '<div style="background:#0A0B0C;border-radius:12px 12px 0 0;padding:18px 22px;">' +
        '<span style="font-weight:700;font-size:17px;color:#F4F5F6;">Nel<span style="color:#1BB35C;">view</span></span>' +
        '<span style="float:right;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#1BB35C;padding-top:4px;">' + badge + '</span>' +
      '</div>' +
      '<div style="border:1px solid #e3ece7;border-top:0;border-radius:0 0 12px 12px;padding:20px 22px;">' +
        '<p style="margin:0 0 14px;color:#6B7178;font-size:12px;">' + esc(data.submitted_at || '') + '</p>' +
        '<table style="border-collapse:collapse;width:100%;">' + rows + '</table>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: TEAM_INBOX,
    subject: subjectBase +
             (data.name ? ' \u2014 ' + subjPart(data.name) : '') +
             (data.country ? ' (' + subjPart(data.country) + ')' : '') +
             (!data.country && data.institution ? ' (' + subjPart(data.institution) + ')' : ''),
    htmlBody: html,
    name: 'Nelview Bot'
  });
}
