// Nelview Review Center — mobile screens for the demo video. Pure functions of props (T-driven).
const RC_G='#1BB35C',RC_G2='#15803D',RC_F='#0F3B2A',RC_INK='#14231B',RC_INK2='#3E4A42',RC_INK3='#6B7280',RC_LINE='#E4E6E9',RC_BG2='#F4F5F6',RC_SUN='#F2A516';
const RC_IC={file:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h5",dollar:"M12 2v20 M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",bulb:"M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",scale:"M12 3v18 M5 21h14 M3 7h18 M6 7l-3 7a3 3 0 0 0 6 0z M18 7l-3 7a3 3 0 0 0 6 0z",mic:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3",book:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",check:"M20 6 9 17l-5-5",upload:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",back:"M15 18l-6-6 6-6",arrow:"M5 12h14 M13 6l6 6-6 6",users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",cap:"M22 10 12 5 2 10l10 5 10-5z M6 12v5c3 2 9 2 12 0v-5",send:"M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",bookOpen:"M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z",bell:"M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0"};
function RcIcon({n,s=18,c='currentColor',w=2}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>{RC_IC[n].split(' M').map((d,i)=><path key={i} d={(i?'M':'')+d}/>)}</svg>;}
const RC_P="M18.38,11.47c-.73.73-1.18,1.75-1.16,2.86.03,2.18,1.89,3.9,4.08,3.9h5.19s.02,0,.02.02v3.98c0,2.36-1.91,4.27-4.27,4.27h-5s-.02,0-.02-.02v-1.52c0-1.09,0-2.77-.27-3.75-.59-2.16-2.72-2.68-3.83-2.67-2.18.03-4.44,1.75-3.82,6.53v1.41s0,.02-.02.02h-5c-2.36,0-4.27-1.91-4.27-4.27v-3.98s0-.02.02-.02h5.53c1.09,0,2.08-.45,2.8-1.16.73-.73,1.18-1.75,1.16-2.86-.03-2.18-1.89-3.9-4.07-3.9H.02s-.02,0-.02-.02v-6.02C0,1.91,1.91,0,4.27,0h5s.02,0,.02.02v3.88c0,1.09.45,2.08,1.16,2.8.73.73,1.75,1.18,2.86,1.16,2.18-.03,3.9-1.89,3.9-4.08V.02s0-.02.02-.02h5c2.36,0,4.27,1.91,4.27,4.27v6.02s0,.02-.02.02h-5.31c-1.09,0-2.08.45-2.8,1.16Z";
function RcLogo({s=24,c=RC_INK}){return <svg width={s} height={s} viewBox="0 0 26.5 26.51" style={{display:'block'}}><path fill={c} d={RC_P}/>{[[13.25,3.3],[13.25,22.83],[22.43,14.09],[4.22,14.09]].map((d,i)=><circle key={i} fill={c} cx={d[0]} cy={d[1]} r="1.44"/>)}</svg>;}

const rcS={
  abs:{position:'absolute'},
  scr:{position:'absolute',top:0,left:0,width:390,height:844,boxSizing:'border-box',background:'#fff',overflow:'hidden',fontFamily:"'Geist',system-ui,sans-serif",color:RC_INK,letterSpacing:'-.01em'},
  h1:{fontSize:26,fontWeight:680,letterSpacing:'-.04em',lineHeight:1.1},
  sub:{fontSize:14,color:RC_INK3,marginTop:6,lineHeight:1.4},
  btn:{position:'absolute',left:18,right:18,height:54,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:16.5,fontWeight:600,color:'#fff'},
};
function RcStatus(){return <div style={{...rcS.abs,top:0,left:0,right:0,height:46,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 30px 0 34px',fontSize:15,fontWeight:600}}><span>9:41</span><span style={{display:'flex',gap:6,alignItems:'center'}}><span style={{display:'flex',gap:2,alignItems:'flex-end'}}>{[5,7,9,11].map(h=><i key={h} style={{width:3,height:h,background:RC_INK,borderRadius:1}}/>)}</span><span style={{width:24,height:11,border:'1.5px solid '+RC_INK,borderRadius:3,padding:1.5,display:'flex'}}><i style={{flex:1,background:RC_INK,borderRadius:1}}/></span></span></div>;}
function RcAppBar({title,back}){return <div style={{...rcS.abs,top:46,left:0,right:0,height:56,display:'flex',alignItems:'center',gap:10,padding:'0 18px',borderBottom:'1px solid '+RC_LINE}}>{back?<RcIcon n="back" s={22}/>:<RcLogo s={22}/>}<b style={{fontSize:17,fontWeight:650,letterSpacing:'-.02em',flex:1}}>{title}</b><RcIcon n="bell" s={20} c={RC_INK2}/><span style={{width:32,height:32,borderRadius:16,background:RC_G2,color:'#fff',fontSize:12,fontWeight:650,display:'flex',alignItems:'center',justifyContent:'center'}}>AO</span></div>;}

const RC_TYPES=[['file','Journal Manuscript','IMRaD · Peer-review','#E8F7EE',RC_G2],['dollar','Grant Proposal','NIH · ERC criteria','#FBF0D6','#B47700'],['bulb','Research Proposal','Aims · Feasibility','#E8F7EE',RC_G2],['scale','Ethics Application','IRB · Helsinki','#FDECEC','#C0262D'],['mic','Conference Abstract','Structured abstract','#FBF0D6','#B47700'],['book','Book Proposal','Market · Scope','#E8F7EE',RC_G2]];
// selected: 0..1 selection amount on Journal card; press: 0..1 continue enabled
function RcHome({sel,cta,press}){
  return <div style={rcS.scr}><RcStatus/><RcAppBar title="New review"/>
    <div style={{...rcS.abs,top:124,left:18,right:18}}><div style={rcS.h1}>Research Review Center</div><div style={rcS.sub}>One upload. The right framework. Expert-level feedback.</div></div>
    <div style={{...rcS.abs,top:212,left:18,fontSize:14,fontWeight:600}}>What are you uploading?</div>
    {RC_TYPES.map((t,i)=>{const x=18+(i%2)*183,y=244+Math.floor(i/2)*110,on=i===0?sel:0;
      return <div key={i} style={{...rcS.abs,left:x,top:y,width:171,height:98,borderRadius:16,border:`${1+on}px solid ${on>.5?RC_G:RC_LINE}`,background:on>.01?`rgba(232,247,238,${on})`:'#fff',padding:14,display:'flex',flexDirection:'column',gap:8,transform:`scale(${1-.04*(i===0?press:0)})`}}>
        <span style={{width:34,height:34,borderRadius:10,background:t[3],color:t[4],display:'flex',alignItems:'center',justifyContent:'center'}}><RcIcon n={t[0]} s={17}/></span>
        <div><b style={{fontSize:14,fontWeight:620,display:'block',lineHeight:1.2}}>{t[1]}</b><span style={{fontSize:11.5,color:RC_INK3}}>{t[2]}</span></div>
        {i===0&&<span style={{...rcS.abs,top:12,right:12,width:22,height:22,borderRadius:11,background:RC_G,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${on})`}}><RcIcon n="check" s={13} c="#fff" w={3.2}/></span>}
      </div>;})}
    <div style={{...rcS.abs,top:590,left:18,right:18,borderRadius:16,background:RC_F,color:'#fff',padding:'16px 16px',opacity:sel,transform:`translateY(${(1-sel)*16}px)`}}><b style={{fontSize:14,fontWeight:620}}>Journal manuscript framework</b><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>{['Methods','Statistics','Novelty','Ethics','Journal fit'].map(x=><span key={x} style={{fontSize:11.5,fontWeight:560,background:'rgba(255,255,255,.12)',padding:'4px 9px',borderRadius:99}}>{x}</span>)}</div></div>
    <div style={{...rcS.btn,top:760,background:cta>.5?RC_G:'#C9CDD2',transform:`scale(${1-.04*cta*0})`}}>Continue<RcIcon n="arrow" s={18} c="#fff"/></div>
  </div>;
}
// drop 0..1 file card in, prog 0..1 upload progress, std 0..1 publication chosen, go 0..1
function RcUpload({drop,prog,std,go}){
  const stds=[['cap','Student','Focused · ~3 min'],['bookOpen','Academic','Thorough · ~6 min'],['send','Publication','Rigorous · ~9 min']];
  return <div style={rcS.scr}><RcStatus/><RcAppBar title="Upload" back/>
    <div style={{...rcS.abs,top:118,left:18,display:'flex',gap:8,alignItems:'center',background:'#E8F7EE',color:RC_G2,fontSize:13,fontWeight:600,padding:'6px 12px 6px 8px',borderRadius:99}}><RcIcon n="file" s={15}/>Journal Manuscript</div>
    <div style={{...rcS.abs,top:164,left:18,right:18,height:170,borderRadius:18,border:`1.5px dashed ${drop>.5?RC_G:'#D3D7DC'}`,background:drop>.5?'#F3FBF6':RC_BG2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
      <span style={{width:52,height:52,borderRadius:14,background:'#fff',border:'1px solid '+RC_LINE,display:'flex',alignItems:'center',justifyContent:'center',color:RC_G2,opacity:1-drop}}><RcIcon n="upload" s={22}/></span>
      <span style={{fontSize:14.5,fontWeight:600,opacity:1-drop}}>Drop your PDF or Word file</span>
      <div style={{...rcS.abs,left:16,right:16,top:48,height:74,borderRadius:14,background:'#fff',border:'1px solid '+RC_LINE,boxShadow:'0 12px 30px -16px rgba(10,13,20,.3)',padding:'12px 14px',display:'flex',gap:12,alignItems:'center',opacity:drop,transform:`translateY(${(1-drop)*-40}px)`}}>
        <span style={{width:40,height:48,borderRadius:8,background:'#FDECEC',color:'#C0262D',fontSize:10,fontWeight:700,display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:6}}>PDF</span>
        <div style={{flex:1,minWidth:0}}><b style={{fontSize:13.5,fontWeight:600,display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>microgravity-enzyme-kinetics.pdf</b><span style={{fontSize:12,color:RC_INK3}}>{prog>=1?'14 pages · 6,210 words':`Uploading ${Math.round(prog*100)}%`}</span>
          <div style={{height:5,borderRadius:3,background:RC_BG2,marginTop:6,overflow:'hidden'}}><i style={{display:'block',height:'100%',width:`${prog*100}%`,background:RC_G}}/></div></div>
      </div>
    </div>
    <div style={{...rcS.abs,top:362,left:18,fontSize:14,fontWeight:600}}>Review standard</div>
    {stds.map((s,i)=>{const on=i===2?std:(i===1?1-std:0);return <div key={i} style={{...rcS.abs,left:18,right:18,top:394+i*72,height:62,borderRadius:14,border:`${1+on}px solid ${on>.5?RC_G:RC_LINE}`,background:on>.5?'#F3FBF6':'#fff',display:'flex',alignItems:'center',gap:12,padding:'0 14px'}}>
      <span style={{width:34,height:34,borderRadius:10,background:on>.5?RC_G:RC_BG2,color:on>.5?'#fff':RC_INK2,display:'flex',alignItems:'center',justifyContent:'center'}}><RcIcon n={s[0]} s={16}/></span>
      <div style={{flex:1}}><b style={{fontSize:14.5,fontWeight:620,display:'block'}}>{s[1]} review</b><span style={{fontSize:12,color:RC_INK3}}>{s[2]}</span></div>
      <span style={{width:20,height:20,borderRadius:10,border:`2px solid ${on>.5?RC_G:'#D3D7DC'}`,display:'flex',alignItems:'center',justifyContent:'center'}}><i style={{width:10,height:10,borderRadius:5,background:RC_G,transform:`scale(${on})`}}/></span></div>;})}
    <div style={{...rcS.btn,top:760,background:prog>=1?RC_G:'#C9CDD2',transform:`scale(${1-.04*go})`}}>Start review<RcIcon n="arrow" s={18} c="#fff"/></div>
  </div>;
}
const RC_STEPS=['Document received','Structure parsed','Framework matched','AI evaluation','Readiness score','Recommendations'];
function RcAnalyze({k}){ // k: 0..6 steps done (fractional)
  const pct=Math.min(1,k/6);
  return <div style={rcS.scr}><RcStatus/><RcAppBar title="Reviewing" back/>
    <div style={{...rcS.abs,top:140,left:0,right:0,display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <div style={{position:'relative',width:150,height:150}}><svg width="150" height="150" style={{transform:'rotate(-90deg)'}}><circle cx="75" cy="75" r="66" fill="none" stroke={RC_BG2} strokeWidth="10"/><circle cx="75" cy="75" r="66" fill="none" stroke={RC_G} strokeWidth="10" strokeLinecap="round" strokeDasharray={414.7} strokeDashoffset={414.7*(1-pct)}/></svg>
        <div style={{...rcS.abs,inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><RcLogo s={46}/></div></div>
      <b style={{fontSize:21,fontWeight:660,letterSpacing:'-.03em'}}>Reading your manuscript</b><span style={{fontSize:13.5,color:RC_INK3,marginTop:-8}}>Publication review · {Math.round(pct*100)}%</span></div>
    <div style={{...rcS.abs,top:420,left:18,right:18,borderRadius:18,border:'1px solid '+RC_LINE,padding:'6px 16px'}}>
      {RC_STEPS.map((s,i)=>{const d=clamp(k-i,0,1),act=Math.floor(k)===i;return <div key={i} style={{display:'flex',alignItems:'center',gap:12,height:52,borderTop:i?'1px solid '+RC_LINE:'none'}}>
        <span style={{width:26,height:26,borderRadius:13,background:d>=1?RC_G:(act?'#E8F7EE':RC_BG2),display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Geist Mono',monospace",fontSize:11,fontWeight:600,color:act?RC_G2:RC_INK3}}>{d>=1?<RcIcon n="check" s={13} c="#fff" w={3.2}/>:'0'+(i+1)}</span>
        <span style={{fontSize:14.5,fontWeight:d>=1||act?600:500,color:d>=1||act?RC_INK:RC_INK3,flex:1}}>{s}</span>
        {act&&<span style={{fontSize:12,color:RC_G2,fontWeight:600}}>Working…</span>}</div>;})}
    </div>
  </div>;
}
const RC_MET=[['Methodology',88],['Novelty',75],['Statistical integrity',84],['Ethics compliance',91]];
const RC_RECS=[['Major','Sharpen the novelty statement','Name the gap explicitly in the abstract.','#FEF3E2','#B45309'],['Major','Add a power analysis','Justify the sample size (n=42) in §2.4.','#FEF3E2','#B45309'],['Minor','3 references missing DOIs','Auto-fix available in Citations.','#EBEDEF',RC_INK2],['Strong','Methodology and ethics','Already meet publication standard.','#E7F6EE','#12803F']];
// score 0..1 ring, bars 0..1, recs 0..1 reveal, scroll px, hl index highlight 0..1
function RcResult({score,bars,recs,scroll,exp}){
  const n=Math.round(82*score);
  return <div style={rcS.scr}><RcStatus/><RcAppBar title="Review report" back/>
    <div style={{...rcS.abs,top:102,left:0,right:0,height:742,overflow:'hidden'}}><div style={{transform:`translateY(${-scroll}px)`}}>
      <div style={{margin:'18px 18px 0',borderRadius:22,background:RC_F,color:'#fff',padding:'22px 20px',display:'flex',gap:18,alignItems:'center'}}>
        <div style={{position:'relative',width:112,height:112,flexShrink:0}}><svg width="112" height="112" style={{transform:'rotate(-90deg)'}}><circle cx="56" cy="56" r="49" fill="none" stroke="#1E5C43" strokeWidth="9"/><circle cx="56" cy="56" r="49" fill="none" stroke={RC_G} strokeWidth="9" strokeLinecap="round" strokeDasharray={307.9} strokeDashoffset={307.9*(1-.82*score)}/></svg>
          <div style={{...rcS.abs,inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><b style={{fontSize:36,fontWeight:700,letterSpacing:'-.05em',lineHeight:1}}>{n}</b><span style={{fontSize:11,color:'#B9CBBF'}}>of 100</span></div></div>
        <div><span style={{display:'inline-block',fontSize:12,fontWeight:600,background:'rgba(242,165,22,.16)',color:RC_SUN,padding:'4px 10px',borderRadius:99,opacity:score}}>Accept · minor revision</span><b style={{display:'block',fontSize:17,fontWeight:620,marginTop:10,lineHeight:1.25,letterSpacing:'-.02em'}}>Strong methods. Novelty is the lever.</b><span style={{fontSize:12.5,color:'#B9CBBF'}}>Publication review · J. Biol. Chem.</span></div>
      </div>
      <div style={{margin:'16px 18px 0',borderRadius:18,border:'1px solid '+RC_LINE,padding:'16px 16px 6px'}}><b style={{fontSize:14,fontWeight:620}}>Criteria</b>
        {RC_MET.map((m,i)=>{const b=clamp(bars*1.4-i*.13,0,1);return <div key={i} style={{padding:'12px 0 10px'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13.5,marginBottom:7}}><span style={{color:RC_INK2}}>{m[0]}</span><b style={{fontWeight:650}}>{Math.round(m[1]*b)}</b></div><div style={{height:7,borderRadius:4,background:RC_BG2,overflow:'hidden'}}><i style={{display:'block',height:'100%',width:`${m[1]*b}%`,background:m[1]<80?RC_SUN:RC_G,borderRadius:4}}/></div></div>;})}
      </div>
      <div style={{margin:'18px 18px 0',fontSize:14,fontWeight:620}}>What to fix first</div>
      {RC_RECS.map((r,i)=>{const o=clamp(recs*1.6-i*.2,0,1);return <div key={i} style={{margin:'10px 18px 0',borderRadius:14,border:'1px solid '+RC_LINE,padding:'12px 14px',display:'flex',gap:12,alignItems:'flex-start',opacity:o,transform:`translateY(${(1-o)*14}px)`}}>
        <span style={{fontSize:11,fontWeight:650,background:r[3],color:r[4],padding:'3px 8px',borderRadius:99,marginTop:1,minWidth:52,textAlign:'center'}}>{r[0]}</span>
        <div><b style={{fontSize:14,fontWeight:620,display:'block'}}>{r[1]}</b><span style={{fontSize:12.5,color:RC_INK3}}>{r[2]}</span></div></div>;})}
      <div style={{margin:'16px 18px 0',height:54,borderRadius:14,background:RC_INK,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:15.5,fontWeight:600,transform:`scale(${1-.04*exp})`}}><RcIcon n="users" s={17} c="#fff"/>Request expert review</div>
      <div style={{height:120}}/>
    </div></div>
  </div>;
}
function RcPhone({children}){return <div className="rc-phone" style={{position:'relative',width:430,height:882,filter:'drop-shadow(0 50px 60px rgba(10,30,20,.35)) drop-shadow(0 16px 20px rgba(10,30,20,.2))'}}>
  <div style={{position:'absolute',left:20,top:17,width:390,height:846,borderRadius:52,overflow:'hidden',background:'#fff'}}>{children}
    <div style={{position:'absolute',bottom:8,left:'50%',marginLeft:-70,width:140,height:5,borderRadius:3,background:RC_INK,opacity:.85,zIndex:7}}/></div>
  <img src="../assets/phone-frame.png" alt="" style={{position:'absolute',inset:0,width:430,height:882,pointerEvents:'none',zIndex:8}}/></div>;}
Object.assign(window,{RC_P,RcHome,RcUpload,RcAnalyze,RcResult,RcPhone,RcLogo,RcIcon});
