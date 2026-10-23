# Collect Nelview beta applications in a Google Sheet

This sends every landing-page email signup and every full application straight
into a Google Sheet (openable in Excel). ~5 minutes, free, no add-ons.

## 1. Make the sheet
1. Go to https://sheets.new — name it e.g. **Nelview Beta Applications**.

## 2. Add the script
2. In the sheet: **Extensions → Apps Script**.
3. Delete whatever is there and paste this in, then click the **Save** icon:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Applications') || ss.insertSheet('Applications');
    var cols = ['submitted_at','stage','name','email','country','role',
                'institution','fields','reviews','supervises','working_on','heard'];
    if (sheet.getLastRow() === 0) sheet.appendRow(cols);
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow(cols.map(function (c) { return data[c] || ''; }));
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

## 3. Deploy it as a web app
4. Top-right **Deploy → New deployment**.
5. Click the gear next to "Select type" → choose **Web app**.
6. Settings:
   - **Description:** anything (e.g. "Nelview beta intake")
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**   ← important, so the website can post to it
7. **Deploy** → authorize when prompted (pick your account → Advanced → "Go to … (unsafe)" → Allow — this is normal for your own script).
8. Copy the **Web app URL** (ends in `/exec`).

## 4. Connect the site
Paste that `/exec` URL between the quotes of `SHEET_ENDPOINT` in **two** files:
- `Join the Beta.html`  → `var SHEET_ENDPOINT='';`
- `Nelview.html`        → `var SHEET_ENDPOINT='';`

…or just send me the URL and I'll drop it into both.

## Done
New rows appear in the **Applications** tab in real time. Columns:
`submitted_at, stage, name, email, country, role, institution, fields, reviews,
supervises, working_on, heard`.

- **stage** = `Email signup` (landing page) or `Full application` (full form).
- **reviews** includes "Grant proposal" when they're seeking grant review.
- **supervises** captures MSc / PhD / both.

Download/export from Google Sheets any time via **File → Download → Microsoft Excel (.xlsx)**.

### Notes
- The site uses `mode:'no-cors'`, so the browser won't show the script's response — that's expected; rows still land. Test by submitting once and checking the sheet.
- `localStorage` + the `#admin` CSV export still work as a local backup even after the Sheet is connected.


## Update — live place in line + reference (2026-09-29)
1. Open the Apps Script project bound to the beta sheet → replace **Code.gs** with the new version in this project.
2. **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.** Keep the same web-app URL (the site already uses it).
   Access must stay **Anyone**.
3. The script adds three columns to "Applications" automatically: `position`, `reference`, `ref_code`.
   Existing rows keep working; they just have blank references until they re-apply (same email returns their spot).

What the site now gets back after submitting: `{ ok, position, reference, ref_code, referrals, total }`.
- **Place in line** = sign-up order, moved up 3 places per friend who joins with their link. Re-checked every 20 s while the page is open.
- **Reference** is generated and stored server-side, and included in the confirmation email.
- **Share link** `nelview.com/beta?ref=CODE` credits the referrer automatically.
- Same email twice → no duplicate row; the page shows their existing spot.


## Update — every form now writes to the sheet
| Form | Page | Stage sent | Where it lands |
|---|---|---|---|
| Beta waitlist | web/waitlist.html | Full application | Beta sheet → **Applications** |
| Book a demo | web/contact.html | Demo request | Demo sheet → **Demo Requests** |
| Talk to sales | Institution Onboarding | Demo request (institutions) | Demo sheet → **Demo Requests** |
| Institution sign-up wizard | Institution Onboarding | Institution signup | Beta sheet → **Institution Signups** |
| Expert reviewer application | web/apply.html | Expert application | Beta sheet → **Expert Applications** |
| Newsletter | web/resources.html | Newsletter | Beta sheet → **Subscribers** |
| Grant alerts | web/pledge.html | Pledge grant alerts | Beta sheet → **Subscribers** |

New tabs are created on the first submission. Expert applicants get a branded confirmation; every form alerts team@nelview.com.
The home-page email box only pre-fills the waitlist (not stored on its own, so it can't create duplicate waitlist rows).
CV files are not uploaded — only the file name is stored. Redeploy (Manage deployments → New version) after pasting the new Code.gs.


## Update — website forms only (portals connect at launch)
Team alerts now go to **team@nelview.com and nelviewai@gmail.com**.
| Website form | Tab | Emails |
|---|---|---|
| Join waitlist (Sign in leads here) | Applications | Applicant confirmation + team alert |
| Expert / human reviewer application | Expert Applications | Applicant confirmation + team alert |
| Institution demo / "Set up your institution" (contact.html) | Demo Requests (demo sheet) | Requester confirmation + team alert |
| General contact (contact.html → General contact tab) | Contact | Sender confirmation + team alert |
| Newsletter / grant alerts | Subscribers | Team alert |
Institution Onboarding wizard and all portals are **not** connected yet.
