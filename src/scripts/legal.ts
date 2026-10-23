// @ts-nocheck
// legal.ts: ported from the static Nelview site. Runs as a classic browser script (compiled by tsc to public/js).
// Shared globals are declared in src/types/globals.d.ts. Remove @ts-nocheck and tighten types incrementally.
window.NV_LEGAL={
terms:{t:'Terms of Service',u:'September 1, 2026',tl:['You own everything you upload and everything you write.','Nelview evaluates your work; you stay responsible for what you submit.','Paid plans renew until you cancel. You can cancel any time.'],s:[
['Who we are','These terms are an agreement between you and Nelverse, the company that operates Nelview, based in Accra, Ghana. By creating an account or using Nelview you agree to them.'],
['Your account','You must be at least 16 to use Nelview. Keep your login details secure and tell us promptly at <a href="mailto:team@nelview.com">team@nelview.com</a> if you believe your account has been accessed without permission. Institution accounts are managed by the institution\'s administrators.'],
['Your content','You keep all rights to the documents you upload. You give us a limited licence to process them only to provide the review you asked for. We do not use your documents to train models, and we delete them after review as described in our <a href="privacy.html">Privacy Policy</a>.'],
['What Nelview does and does not do','Nelview evaluates research documents and gives feedback and a readiness score. It does not write or rewrite your research, and a score is not a guarantee of acceptance by any journal, examiner or funder. You remain responsible for the originality and integrity of your work.'],
['Expert reviewers','Expert reviews are carried out by independent reviewers under double-blind conditions. Reviewers agree to keep documents confidential and to follow our reviewer code of conduct.'],
['Acceptable use','Do not upload work you do not have the right to share, attempt to reverse-engineer the service, use Nelview to evaluate content for harassment or fraud, or interfere with other users.'],
['Plans, billing and cancellation','Paid plans are billed monthly or annually in advance and renew automatically. You can cancel at any time from your account settings; you keep access until the end of the paid period. Prices are shown in USD and local payment methods may apply.'],
['Termination','You can close your account at any time. We may suspend accounts that break these terms, and will tell you why unless the law prevents us.'],
['Liability','Nelview is provided as is. To the extent the law allows, our total liability to you is limited to the amount you paid us in the twelve months before the claim.'],
['Changes and governing law','We will give at least 30 days\' notice of material changes. These terms are governed by the laws of the Republic of Ghana.']]},
privacy:{t:'Privacy Policy',u:'September 1, 2026',tl:['Your documents are deleted after review.','We never use your work to train models.','We never sell your data.'],s:[
['What this covers','This policy explains how Nelverse collects and uses personal data when you use Nelview, including our website, portals and apps. We process data in line with Ghana\'s Data Protection Act, 2012 (Act 843) and, where it applies, the GDPR.'],
['What we collect','<b>Account data:</b> name, email, institution, role and field of study. <b>Documents:</b> the files you upload for review. <b>Usage data:</b> pages visited, features used and device information. <b>Payment data:</b> handled by our payment providers; we never see full card numbers.'],
['How we use it','To run reviews and show your results, to operate and secure your account, to provide support, and to improve the service using aggregated, de-identified usage data. We do not use your documents to train AI models.'],
['Document retention','Uploaded documents are processed for review and deleted once the review is complete, unless you choose to save them to your library. Saved documents are deleted within 30 days of you removing them or closing your account.'],
['Who we share it with','Expert reviewers see only the documents you send for expert review, with identifying details removed. We use a small number of processors for hosting, email and payments, bound by contract to protect your data. If your account is provided by an institution, its administrators can see your review scores and activity. We never sell personal data.'],
['International transfers','Some processors operate outside Ghana. Where data leaves the country we rely on appropriate safeguards such as standard contractual clauses.'],
['Your rights','You can access, correct, export or delete your data at any time from your account settings, or by emailing us. You can also object to processing or complain to Ghana\'s Data Protection Commission.'],
['Cookies','We use essential cookies to keep you signed in, and optional analytics cookies only with your consent. See our <a href="cookies.html">Cookie Policy</a>.'],
['Contact','Our data protection lead can be reached at <a href="mailto:privacy@nelview.com">privacy@nelview.com</a>.']]},
security:{t:'Security',u:'September 1, 2026',tl:['Encrypted in transit and at rest.','Documents are isolated per review and deleted afterwards.','Report a vulnerability to security@nelview.com.'],s:[
['Our approach','Research is sensitive, often unpublished and sometimes commercially valuable. We design Nelview so that the fewest possible systems and people ever touch your work.'],
['Encryption','All traffic uses TLS 1.2 or higher. Documents and databases are encrypted at rest with AES-256.'],
['Document isolation','Each review runs in an isolated environment. Documents are deleted when the review completes unless you save them, and are never used to train models.'],
['Access control','Staff access to production systems is limited, requires multi-factor authentication and is logged. Expert reviewers see only anonymised documents assigned to them.'],
['Institution controls','Institution plans include single sign-on, role-based permissions and audit logs for administrators.'],
['Infrastructure','Nelview runs on established cloud providers with independent security certifications. We back up data daily and test recovery regularly.'],
['Responsible disclosure','If you find a vulnerability, email <a href="mailto:security@nelview.com">security@nelview.com</a> with details. We\'ll acknowledge within two working days and keep you updated. Please don\'t access other users\' data or disrupt the service while testing.']]},
cookies:{t:'Cookie Policy',u:'September 1, 2026',tl:['Essential cookies keep you signed in.','Analytics cookies are off until you agree.','No advertising cookies.'],s:[
['What cookies are','Cookies are small files stored by your browser. We use them to make Nelview work and, with your consent, to understand how it is used.'],
['Essential cookies','These keep you signed in, remember your language and protect against fraud. The service cannot work without them.'],
['Analytics cookies','With your consent, we use privacy-focused analytics to count visits and see which features are used. The data is aggregated and not used to identify you.'],
['What we don\'t use','We do not use advertising or cross-site tracking cookies.'],
['Managing cookies','You can change your choice at any time from the cookie settings link in the footer, or block cookies in your browser settings.']]}};
(function(){
var k=document.body.getAttribute('data-doc'),d=NV_LEGAL[k];if(!d)return;
var N={terms:'Terms',privacy:'Privacy',security:'Security',cookies:'Cookies'};
document.title=d.t+' · Nelview';
var id=function(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');};
document.getElementById('lg-hd').innerHTML="<h1>"+d.t+"</h1><div class='meta'><span>Last updated "+d.u+"</span><span>·</span><span>Nelverse, Accra, Ghana</span></div><div class='lg-docs'>"+Object.keys(N).map(function(x){return "<a href='"+x+".html'"+(x===k?" class='on'":"")+">"+N[x]+"</a>";}).join('')+"</div>";
document.getElementById('toc').innerHTML="<h6>CONTENTS</h6>"+d.s.map(function(s){return "<a href='#"+id(s[0])+"'>"+s[0]+"</a>";}).join('');
document.getElementById('lg-b').innerHTML="<div class='tldr'><h6>IN SHORT</h6><ul>"+d.tl.map(function(t){return "<li data-ic='check'>"+t+"</li>";}).join('')+"</ul></div>"+d.s.map(function(s,i){return "<h2 id='"+id(s[0])+"'><span class='no'>"+String(i+1).padStart(2,'0')+"</span>"+s[0]+"</h2><p>"+s[1]+"</p>";}).join('')+"<p class='lg-contact'>Questions about this policy? Email <a href='mailto:team@nelview.com'>team@nelview.com</a> or write to Nelverse, Accra, Ghana.</p>";
var links=document.querySelectorAll('#toc a'),hs=document.querySelectorAll('#lg-b h2');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id);});});},{rootMargin:'-20% 0px -70% 0px'});hs.forEach(function(h){io.observe(h);});}
})();
