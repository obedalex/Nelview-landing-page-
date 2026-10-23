// @ts-nocheck
// motion.ts: ported from the static Nelview site. Runs as a classic browser script (compiled by tsc to public/js).
// Shared globals are declared in src/types/globals.d.ts. Remove @ts-nocheck and tighten types incrementally.
/* Nelview motion: one owner per element, shared easing, no transform conflicts. Content is never left hidden. */
(function(){
var M=window.Motion;if(!M||!M.animate)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var animate=M.animate,stagger=M.stagger;
var OUT=[.22,1,.36,1],IO=[.65,0,.35,1],SOFT={type:'spring',stiffness:170,damping:26,mass:1};
var FINE=matchMedia('(pointer:fine)').matches;
var css=document.createElement('style');css.textContent='.nv-prog{position:fixed;left:0;top:0;height:2px;width:100%;transform-origin:0 50%;transform:scaleX(0);background:var(--g,#1BB35C);z-index:9999;pointer-events:none}.nv-veil{position:fixed;inset:0;background:var(--forest,#0F3B2A);z-index:9998;pointer-events:none;transform:translateY(100%)}html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}main .photo{overflow:hidden}.card,.post,.pp-col,.role,.p4>div,.cta2 a{transition:transform .6s cubic-bezier(.22,1,.36,1),box-shadow .6s cubic-bezier(.22,1,.36,1)}@media(pointer:fine){.card:hover,.post:hover,.pp-col:hover,.role:hover,.p4>div:hover,.cta2 a:hover{transform:translateY(-4px)}}';document.head.appendChild(css);
var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap';document.head.appendChild(fl);

/* reveal queue: IntersectionObserver per element, flushed on print/hide */
var jobs=new Map(),owned=new WeakSet();
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)run(e.target)})},{rootMargin:'0px 0px -8% 0px',threshold:0}):null;
function inView(el){var r=el.getBoundingClientRect();return r.top<innerHeight*.95&&r.bottom>0}
function when(el,fn){jobs.set(el,fn);if(io)io.observe(el);sched()}
function run(el){var f=jobs.get(el);if(!f)return;jobs.delete(el);if(io)io.unobserve(el);f()}
function check(){jobs.forEach(function(f,el){var r=el.getBoundingClientRect();if(r.top<innerHeight*.92&&r.bottom>0)run(el)})}
var tk=false;function sched(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;check()})}
addEventListener('scroll',sched,{passive:true});addEventListener('resize',sched);
function flush(){jobs.forEach(function(f,el){io&&io.unobserve(el);f()});jobs.clear()}
setTimeout(flush,12000);
addEventListener('beforeprint',flush);document.addEventListener('visibilitychange',function(){if(document.hidden)flush()});
window.nvRevealAll=flush;
function clean(els,props){els.forEach(function(e){props.forEach(function(p){e.style[p]=''});e.style.willChange=''})}

function fadeUp(els,d,delay){els.forEach(function(e){owned.add(e);e.style.opacity='0';e.style.transform='translate3d(0,28px,0)';e.style.willChange='transform,opacity'});
return function(){animate(els,{opacity:[0,1],transform:['translate3d(0,28px,0)','translate3d(0,0,0)']},{duration:.6,delay:stagger?stagger(d||.06,{startDelay:delay||0}):0,ease:OUT}).then(function(){clean(els,['opacity','transform'])})}}
function maskUp(el,delay){owned.add(el);el.style.clipPath='inset(0 0 100% 0)';el.style.transform='translate3d(0,0.5em,0)';el.style.willChange='transform,clip-path';
return function(){animate(el,{clipPath:['inset(0 0 100% 0)','inset(0 0 -20% 0)'],transform:['translate3d(0,0.5em,0)','translate3d(0,0,0)']},{duration:.7,delay:delay||0,ease:OUT}).then(function(){clean([el],['clipPath','transform'])})}}

/* hero: headline masks up, the rest follows */
var hero=document.querySelector('.hero2 .wrap,.st-hero .wrap,.ab-hero .wrap,.pr-hero .wrap,.phd .wrap,.page-hero .wrap,.pl-hero .wrap,.wl');
var introOn=!sessionStorage.getItem('nv_intro')&&!sessionStorage.getItem('nv_tx'),txIn=!!sessionStorage.getItem('nv_tx');
var heroDelay=introOn?.35:txIn?.2:.05;
if(hero){var hh=hero.querySelector('h1');if(hh)maskUp(hh,heroDelay)();
var hk=[].slice.call(hero.querySelectorAll(':scope > *,:scope > div > *')).filter(function(e){return e.offsetParent!==null&&e!==hh&&!e.contains(hh)&&!e.classList.contains('tour')&&!e.closest('.tour')}).slice(0,6);
if(hk.length)fadeUp(hk,.08,heroDelay+.25)()}

/* headings */
document.querySelectorAll('main .h2,main .statement').forEach(function(h){if(hero&&hero.contains(h))return;if(inView(h)){owned.add(h);return}when(h,maskUp(h))});

/* groups: children stagger */
var GROUPS='.fx,.bc,.bento,.grid2,.grid3,.grid4,.feats,.steps,.nums,.stats,.board,.st-team,.st-chap,.vs,.vs-rows,.ex-tiers,.pp,.p4,.fund,.funds2,.cta2,.pgrid,.ttl,.vrows,.wall,.xrows,.integ-g,.roles,.gi-l,.recs';
document.querySelectorAll(GROUPS).forEach(function(g){if(hero&&hero.contains(g))return;if(g.closest('.hs-track')||g.parentElement.closest(GROUPS))return;if(inView(g))return;var kids=[].slice.call(g.children).filter(function(k){return !owned.has(k)});if(kids.length)when(g,fadeUp(kids,g.classList.contains('integ-g')?.03:.08))});

/* single blocks (lead copy, eyebrows) that aren't already handled */
document.querySelectorAll('main .sec-head>*:not(.h2),main .split-head>*:not(.h2),main .split-head>div>*:not(.h2),main .lead,main .eyebrow,main .vs-ex,main .ex-card,main .ex-sig,main .faq details,main .tabs,main .hs-track>*').forEach(function(e){if(owned.has(e)||(hero&&hero.contains(e))||e.closest('.tour,.cta')||inView(e))return;if(e.querySelector('.h2'))return;when(e,fadeUp([e]))});

/* photos: curtain on the frame; scale on the image unless it's parallaxed */
var PARA='.pband .photo img,.prow .photo img,.mosaic .photo img,.st-band .photo img,.imgband .photo img';
document.querySelectorAll('main .photo').forEach(function(p){if(inView(p)||(hero&&hero.contains(p)))return;var im=p.querySelector('img'),para=im&&im.matches(PARA);p.style.clipPath='inset(100% 0 0 0)';p.style.willChange='clip-path';if(im&&!para)im.style.transform='scale(1.18)';
when(p,function(){animate(p,{clipPath:['inset(100% 0 0 0)','inset(0% 0 0 0)']},{duration:.8,ease:IO}).then(function(){clean([p],['clipPath'])});if(im&&!para)animate(im,{transform:['scale(1.18)','scale(1)']},{duration:1,ease:OUT}).then(function(){im.style.transform=''})})});

/* bars + counters */
document.querySelectorAll('main .bar>span').forEach(function(s){var w=s.style.width;if(!w||inView(s)||s.closest('.tour'))return;s.style.width='0%';when(s,function(){animate(s,{width:['0%',w]},{duration:.8,ease:OUT})})});
document.querySelectorAll('.stats b,.st-stat b').forEach(function(el){if(el.children.length)return;var t=el.textContent,m=t.match(/^([^0-9]*)([\d,]+)(.*)$/);if(!m)return;var end=+m[2].replace(/,/g,'');if(!end||end>100000||inView(el))return;when(el,function(){animate(0,end,{duration:.9,ease:OUT,onUpdate:function(v){el.textContent=m[1]+Math.round(v).toLocaleString()+m[3]}}).then(function(){el.textContent=t})})});

/* scroll-linked: one transform owner each */
if(M.scroll){
var prog=document.createElement('div');prog.className='nv-prog';document.body.appendChild(prog);
M.scroll(animate(prog,{transform:['scaleX(0)','scaleX(1)']},{ease:'linear'}));
document.querySelectorAll(PARA).forEach(function(im,i){var box=im.closest('.photo'),a=im.closest('.mosaic')?(i%2?-5:5):-4;im.style.willChange='transform';M.scroll(animate(im,{transform:['translate3d(0,'+a+'%,0) scale(1.12)','translate3d(0,'+(-a)+'%,0) scale(1.12)']},{ease:'linear'}),{target:box,offset:['start end','end start']})});
document.querySelectorAll('main .sec.dark,main .cta').forEach(function(s){M.scroll(animate(s,{clipPath:['inset(0 2.5% round 28px)','inset(0 0% round 0px)']},{ease:'linear'}),{target:s,offset:['start end','start 0.4']})});
var gb=document.querySelector('.hero2 .grid-bg');if(gb)M.scroll(animate(gb,{transform:['translate3d(0,0,0)','translate3d(0,120px,0)'],opacity:[1,0]},{ease:'linear'}),{target:document.querySelector('.hero2'),offset:['start start','end start']});
var tf=document.querySelector('.tour-frame');if(tf){tf.style.willChange='transform';M.scroll(animate(tf,{transform:['perspective(1600px) rotateX(8deg) scale(.96)','perspective(1600px) rotateX(0deg) scale(1)']},{ease:'linear'}),{target:tf,offset:['start end','start 0.35']})}
var fb=document.querySelector('.ftr-big');if(fb)M.scroll(animate(fb,{transform:['translate3d(0,30%,0)','translate3d(0,0,0)'],opacity:[.25,1]},{ease:'linear'}),{target:fb,offset:['start end','end end']});
var hs=document.querySelector('.hs');if(hs&&FINE&&matchMedia('(min-width:900px) and (min-height:760px)').matches){hs.classList.add('pinned');var tr=hs.querySelector('.hs-track'),dw=0,meas=function(){dw=Math.max(0,tr.scrollWidth-tr.parentNode.clientWidth)};meas();addEventListener('resize',meas);tr.style.willChange='transform';M.scroll(function(p){var e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;tr.style.transform='translate3d('+(-dw*(p*.6+e*.4))+'px,0,0)'},{target:hs,offset:['start start','end end']})}
}

/* micro-interactions */
document.querySelectorAll('.btn').forEach(function(b){b.addEventListener('pointerdown',function(){animate(b,{scale:.97},{duration:.12,ease:OUT})});['pointerup','pointerleave'].forEach(function(ev){b.addEventListener(ev,function(){animate(b,{scale:1},SOFT)})})});
if(FINE)document.querySelectorAll('.btn-lg,.hero-form .btn').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();animate(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.28},{duration:.5,ease:OUT})});b.addEventListener('pointerleave',function(){animate(b,{x:0,y:0},SOFT)})});
function roll(el){if(el.querySelector('.rl')||el.closest('.lsw,.lang-f'))return;for(var n=el.firstChild;n;n=n.nextSibling){if(n.nodeType===3&&n.textContent.trim()){var s=document.createElement('span'),s2=document.createElement('span');s.className='rl';n.parentNode.insertBefore(s,n);s.appendChild(s2);s2.appendChild(n);return}}}
document.querySelectorAll('.hdr .nav>a,.ftr .col a,.btn').forEach(roll);

/* intro (first visit per session) */
if(introOn){sessionStorage.setItem('nv_intro','1');var it=document.createElement('div');it.className='nv-intro';it.innerHTML='<span><i>Nel</i></span><span><i><b>view</b></i></span>';document.documentElement.appendChild(it);var ii=it.querySelectorAll('i');ii.forEach(function(i){i.style.transform='translateY(110%)'});
animate(ii,{transform:['translateY(110%)','translateY(0%)']},{duration:.55,delay:stagger(.06,{startDelay:.05}),ease:OUT}).then(function(){return animate(it,{clipPath:['inset(0 0 0% 0)','inset(0 0 100% 0)']},{duration:.55,delay:.1,ease:IO})}).then(function(){it.remove()});setTimeout(function(){if(it.parentNode)it.remove()},4500)}

/* page transitions */
var veil=document.createElement('div');veil.className='nv-veil';document.body.appendChild(veil);
if(txIn){sessionStorage.removeItem('nv_tx');veil.style.transform='translateY(0%)';requestAnimationFrame(function(){animate(veil,{transform:['translateY(0%)','translateY(-100%)']},{duration:.55,ease:IO}).then(function(){veil.style.transform='translateY(100%)'})})}
document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||a.hasAttribute('download'))return;var h=a.getAttribute('href');if(!h||h[0]==='#'||/^(mailto|tel|javascript|https?):/i.test(h)||!/\.html(\?|#|$)/.test(h))return;var u=new URL(a.href,location.href);if(u.pathname===location.pathname&&u.hash)return;e.preventDefault();sessionStorage.setItem('nv_tx','1');if(lenis)lenis.stop();animate(veil,{transform:['translateY(100%)','translateY(0%)']},{duration:.4,ease:IO}).then(function(){location.href=a.href})});
addEventListener('pageshow',function(e){if(e.persisted){veil.style.transform='translateY(100%)';if(lenis)lenis.start()}});

/* smooth scroll (desktop) */
var lenis=null;
if(FINE){var ls=document.createElement('script');ls.src='https://unpkg.com/lenis@1.1.13/dist/lenis.min.js';ls.onload=function(){if(!window.Lenis)return;lenis=new Lenis({lerp:.1,wheelMultiplier:1,smoothWheel:true});lenis.on('scroll',sched);var frame=0;function raf(t){lenis.raf(t);frame=requestAnimationFrame(raf)}function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0}else if(!frame){frame=requestAnimationFrame(raf)}}document.addEventListener('visibilitychange',visibility);frame=requestAnimationFrame(raf);
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-80,duration:.85,easing:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}})}})};document.head.appendChild(ls)}
})();
