/**
 * KIO Gateway v4.2 - OpenAI Compatible API + Built-in UI
 * Backend: gjosebfngzowbcrwzxnw.supabase.co/functions/v1/openai-compatible
 * Auth:    Authorization: Bearer <API_KEY>
 * Flow:    POST /openai-compatible → task_id → poll /get-task-result → image
 * New:     1K/2K/4K sizes + API debug panel
 */

const HTML_UI = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KIO Gateway - Image Generator</title>
<style>
:root{--bg:#0f0f13;--surface:#1a1a24;--surface2:#22222f;--border:#2e2e3e;--accent:#7c6fff;--accent2:#00d2ff;--text:#e8e8f0;--text2:#888899;--success:#22c55e;--error:#ef4444;--warn:#f59e0b;--radius:14px;}
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.app{display:grid;grid-template-columns:360px 1fr;min-height:100vh;}
@media(max-width:860px){.app{grid-template-columns:1fr;}.sidebar{border-right:none;border-bottom:1px solid var(--border);}}
.sidebar{background:var(--surface);border-right:1px solid var(--border);padding:24px 20px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;}
.logo{display:flex;align-items:center;gap:10px;}
.logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
.logo h1{font-size:1.2rem;font-weight:700;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.logo small{font-size:0.68rem;color:var(--text2);display:block;-webkit-text-fill-color:var(--text2);}
.sec-label{font-size:0.68rem;font-weight:700;letter-spacing:.1em;color:var(--text2);text-transform:uppercase;margin-bottom:5px;}
.field{display:flex;flex-direction:column;gap:5px;}
.field label{font-size:0.8rem;color:var(--text2);font-weight:500;}
input,select,textarea{background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.86rem;padding:8px 11px;width:100%;outline:none;transition:border-color .2s;font-family:inherit;}
input:focus,select:focus,textarea:focus{border-color:var(--accent);}
select option{background:var(--surface2);}
textarea#prompt{min-height:100px;resize:vertical;line-height:1.6;}
/* Size grid */
.size-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.size-btn{background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text2);font-size:0.72rem;font-weight:600;padding:7px 4px;cursor:pointer;text-align:center;transition:all .15s;line-height:1.3;}
.size-btn:hover{border-color:var(--accent);color:var(--text);}
.size-btn.active{border-color:var(--accent);background:rgba(124,111,255,.15);color:var(--accent);}
.size-btn .ratio{font-size:0.65rem;color:var(--text2);display:block;margin-top:2px;}
.size-btn.active .ratio{color:var(--accent);opacity:.7;}
/* Generate btn */
.gen-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:var(--radius);color:#fff;font-size:0.92rem;font-weight:700;padding:12px;cursor:pointer;width:100%;transition:opacity .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:8px;}
.gen-btn:hover{opacity:.9;transform:translateY(-1px);}
.gen-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.gen-btn .spin{width:17px;height:17px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none;}
.gen-btn.loading .spin{display:block;}
.gen-btn.loading .btn-txt{display:none;}
@keyframes spin{to{transform:rotate(360deg);}}
/* Progress */
.prog-wrap{display:none;}
.prog-wrap.show{display:block;}
.prog-lbl{font-size:0.72rem;color:var(--text2);margin-bottom:5px;}
.prog-bar{height:3px;background:var(--border);border-radius:99px;overflow:hidden;}
.prog-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px;transition:width .4s ease;}
/* Status */
.status{display:none;padding:9px 12px;border-radius:8px;font-size:0.8rem;margin-top:2px;}
.status.error{display:flex;gap:7px;background:rgba(239,68,68,.12);color:var(--error);border:1px solid rgba(239,68,68,.2);}
.status.success{display:flex;gap:7px;background:rgba(34,197,94,.1);color:var(--success);border:1px solid rgba(34,197,94,.2);}
/* API debug panel */
.api-panel{background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.api-panel-header{display:flex;align-items:center;justify-content:space-between;padding:9px 13px;cursor:pointer;user-select:none;border-bottom:1px solid transparent;}
.api-panel-header:hover{background:rgba(255,255,255,.03);}
.api-panel.open .api-panel-header{border-bottom-color:var(--border);}
.api-panel-title{font-size:0.75rem;font-weight:700;color:var(--text2);display:flex;align-items:center;gap:6px;}
.api-panel-title .dot{width:7px;height:7px;border-radius:50%;background:var(--border);}
.api-panel-title .dot.ok{background:var(--success);}
.api-panel-title .dot.err{background:var(--error);}
.api-panel-title .dot.pending{background:var(--warn);animation:blink 1s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.api-chevron{font-size:0.7rem;color:var(--text2);transition:transform .2s;}
.api-panel.open .api-chevron{transform:rotate(180deg);}
.api-tabs{display:flex;border-bottom:1px solid var(--border);}
.api-tab{flex:1;padding:7px;font-size:0.72rem;font-weight:600;color:var(--text2);cursor:pointer;text-align:center;border-bottom:2px solid transparent;transition:all .15s;}
.api-tab.active{color:var(--accent);border-bottom-color:var(--accent);}
.api-body{display:none;padding:11px 13px;}
.api-panel.open .api-body{display:block;}
.api-meta{font-size:0.7rem;color:var(--text2);margin-bottom:7px;display:flex;gap:12px;flex-wrap:wrap;}
.api-meta span{display:flex;align-items:center;gap:4px;}
.api-meta .badge{background:var(--surface);padding:2px 7px;border-radius:99px;font-size:0.65rem;font-weight:700;}
.api-meta .badge.ok{color:var(--success);}
.api-meta .badge.err{color:var(--error);}
.api-meta .badge.pend{color:var(--warn);}
pre.api-code{background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:10px;font-size:0.72rem;line-height:1.6;overflow-x:auto;white-space:pre-wrap;word-break:break-all;max-height:200px;overflow-y:auto;color:#a8b4c8;font-family:'SF Mono','Fira Code',monospace;}
pre.api-code .key{color:#7c6fff;}
pre.api-code .str{color:#22d3ee;}
pre.api-code .num{color:#f59e0b;}
pre.api-code .bool{color:#22c55e;}
.copy-btn{font-size:0.68rem;padding:3px 9px;border-radius:5px;background:var(--surface);border:1px solid var(--border);color:var(--text2);cursor:pointer;float:right;margin-bottom:5px;}
.copy-btn:hover{color:var(--text);}
/* Main area */
.main{padding:24px;display:flex;flex-direction:column;gap:24px;overflow-y:auto;}
.empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--text2);text-align:center;padding:60px 20px;}
.empty-icon{font-size:3.5rem;opacity:.25;}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;animation:fadeUp .35s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.result-img{width:100%;display:block;cursor:pointer;transition:transform .2s;}
.result-img:hover{transform:scale(1.003);}
.result-meta{padding:14px 16px;display:flex;flex-direction:column;gap:7px;}
.result-prompt-txt{font-size:0.8rem;color:var(--text2);line-height:1.5;}
.result-actions{display:flex;gap:8px;flex-wrap:wrap;}
.act-btn{padding:6px 14px;border-radius:7px;font-size:0.78rem;font-weight:600;cursor:pointer;border:none;transition:opacity .15s;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}
.act-btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;}
.act-btn.secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border);}
.act-btn:hover{opacity:.82;}
.hist-sec h2{font-size:0.75rem;font-weight:700;letter-spacing:.08em;color:var(--text2);text-transform:uppercase;margin-bottom:12px;}
.hist-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;}
.hist-thumb{border-radius:9px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .2s,transform .15s;position:relative;aspect-ratio:1;background:var(--surface);}
.hist-thumb:hover{border-color:var(--accent);transform:scale(1.04);}
.hist-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.hist-ov{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center;font-size:1.3rem;}
.hist-thumb:hover .hist-ov{opacity:1;}
.lightbox{display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.9);align-items:center;justify-content:center;}
.lightbox.show{display:flex;}
.lightbox img{max-width:92vw;max-height:92vh;border-radius:10px;}
.lb-close{position:fixed;top:18px;right:22px;background:rgba(255,255,255,.12);border:none;color:#fff;width:38px;height:38px;border-radius:50%;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar">
  <div class="logo">
    <div class="logo-icon">&#127912;</div>
    <div><h1>KIO Gateway</h1><small>v4.2 &mdash; medo image</small></div>
  </div>

  <!-- Prompt -->
  <div>
    <div class="sec-label">&#128221; Prompt</div>
    <div class="field">
      <label style="font-size:.73rem">描述 <span style="color:var(--text2);font-weight:400">(Ctrl+Enter 送出)</span></label>
      <textarea id="prompt" placeholder="一隻可愛的小貓坐在窗邊，柔和陽光，吉卜力風格"></textarea>
    </div>
  </div>

  <!-- Model -->
  <div>
    <div class="sec-label">&#9881;&#65039; 設定</div>
    <div class="field">
      <label>模型</label>
      <select id="model">
        <option value="gemini-3.1-pro-preview" selected>gemini-3.1-pro-preview</option>
        <option value="medo-image">medo-image</option>
        <option value="dall-e-3">DALL-E 3</option>
      </select>
    </div>
  </div>

  <!-- Size -->
  <div>
    <div class="sec-label">&#128004; 尺寸</div>
    <div class="size-grid" id="sizeGrid">
      <!-- 1K -->
      <button class="size-btn" data-size="1024x1024" data-label="1K 1:1">1K<span class="ratio">1024&times;1024</span></button>
      <button class="size-btn" data-size="1024x1792" data-label="1K 9:16">1K 縱<span class="ratio">1024&times;1792</span></button>
      <button class="size-btn" data-size="1792x1024" data-label="1K 16:9">1K 橫<span class="ratio">1792&times;1024</span></button>
      <!-- 2K -->
      <button class="size-btn" data-size="2048x2048" data-label="2K 1:1">2K<span class="ratio">2048&times;2048</span></button>
      <button class="size-btn" data-size="2048x3584" data-label="2K 9:16">2K 縱<span class="ratio">2048&times;3584</span></button>
      <button class="size-btn" data-size="3584x2048" data-label="2K 16:9">2K 橫<span class="ratio">3584&times;2048</span></button>
      <!-- 4K -->
      <button class="size-btn" data-size="4096x4096" data-label="4K 1:1">4K<span class="ratio">4096&times;4096</span></button>
      <button class="size-btn" data-size="4096x7168" data-label="4K 9:16">4K 縱<span class="ratio">4096&times;7168</span></button>
      <button class="size-btn" data-size="7168x4096" data-label="4K 16:9">4K 橫<span class="ratio">7168&times;4096</span></button>
    </div>
  </div>

  <!-- Progress -->
  <div class="prog-wrap" id="progWrap">
    <div class="prog-lbl" id="progLbl">正在生成...</div>
    <div class="prog-bar"><div class="prog-fill" id="progFill"></div></div>
  </div>

  <!-- Generate -->
  <button class="gen-btn" id="genBtn">
    <span class="btn-txt">&#10024; 生成圖像</span>
    <div class="spin"></div>
  </button>
  <div class="status" id="statusMsg"></div>

  <!-- API Debug Panel -->
  <div class="api-panel" id="apiPanel">
    <div class="api-panel-header" id="apiToggle">
      <div class="api-panel-title"><div class="dot" id="apiDot"></div>API 資訊</div>
      <span class="api-chevron">&#9660;</span>
    </div>
    <div class="api-tabs" id="apiTabs" style="display:none">
      <div class="api-tab active" data-tab="req">&#128228; 請求</div>
      <div class="api-tab" data-tab="res">&#128229; 響應</div>
      <div class="api-tab" data-tab="poll">&#128260; 輪詢</div>
    </div>
    <div class="api-body" id="apiBody">
      <div id="tabReq">
        <div class="api-meta" id="reqMeta"></div>
        <button class="copy-btn" onclick="copyCode('reqCode')">複製</button>
        <pre class="api-code" id="reqCode">// 尚未發送請求</pre>
      </div>
      <div id="tabRes" style="display:none">
        <div class="api-meta" id="resMeta"></div>
        <button class="copy-btn" onclick="copyCode('resCode')">複製</button>
        <pre class="api-code" id="resCode">// 尚未收到響應</pre>
      </div>
      <div id="tabPoll" style="display:none">
        <div class="api-meta" id="pollMeta"></div>
        <button class="copy-btn" onclick="copyCode('pollCode')">複製</button>
        <pre class="api-code" id="pollCode">// 尚未輪詢</pre>
      </div>
    </div>
  </div>

</aside>
<main class="main" id="main">
  <div class="empty-state" id="emptyState">
    <div class="empty-icon">&#128444;&#65039;</div>
    <h2 style="color:var(--text2);font-weight:500">尚未生成任何圖像</h2>
    <p style="font-size:.8rem;max-width:240px;line-height:1.6">在左側輸入描述並選擇尺寸，點擊「生成圖像」</p>
  </div>
  <div id="latestResult" style="display:none"></div>
  <div class="hist-sec" id="histSec" style="display:none">
    <h2>&#128344; 歷史紀錄</h2>
    <div class="hist-grid" id="histGrid"></div>
  </div>
</main>
</div>
<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose">&#10005;</button>
  <img id="lbImg" src="" alt="">
</div>
<script>
let hist=JSON.parse(localStorage.getItem('kio_h')||'[]');
let progTimer=null, selectedSize='1024x1024';
const $=id=>document.getElementById(id);
const promptEl=$('prompt'),modelEl=$('model');
const genBtn=$('genBtn'),statusMsg=$('statusMsg');
const progWrap=$('progWrap'),progFill=$('progFill'),progLbl=$('progLbl');
const emptyState=$('emptyState'),latestResult=$('latestResult');
const histSec=$('histSec'),histGrid=$('histGrid');
const lightbox=$('lightbox'),lbImg=$('lbImg');
const apiPanel=$('apiPanel'),apiToggle=$('apiToggle'),apiDot=$('apiDot');
const apiTabs=$('apiTabs'),apiBody=$('apiBody');

// ─ Size buttons
document.querySelectorAll('.size-btn').forEach(btn=>{
  if(btn.dataset.size==='1024x1024')btn.classList.add('active');
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize=btn.dataset.size;
  });
});

// ─ API Panel toggle
let panelOpen=false;
apiToggle.addEventListener('click',()=>{
  panelOpen=!panelOpen;
  apiPanel.classList.toggle('open',panelOpen);
  apiTabs.style.display=panelOpen?'flex':'none';
});

// ─ API Tabs
let activeTab='req';
document.querySelectorAll('.api-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.api-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    activeTab=tab.dataset.tab;
    $('tabReq').style.display=activeTab==='req'?'block':'none';
    $('tabRes').style.display=activeTab==='res'?'block':'none';
    $('tabPoll').style.display=activeTab==='poll'?'block':'none';
  });
});

function syntaxHL(obj){
  const s=JSON.stringify(obj,null,2);
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/("[^"]+")\s*:/g,'<span class="key">$1</span>:')
    .replace(/:\s*("[^"]*")/g,': <span class="str">$1</span>')
    .replace(/:\s*(-?\d+\.?\d*)/g,': <span class="num">$1</span>')
    .replace(/:\s*(true|false|null)/g,': <span class="bool">$1</span>');
}

function setApiReq(url,method,body,ms){
  $('reqCode').innerHTML=syntaxHL({endpoint:url,method,body});
  $('reqMeta').innerHTML=`<span><span class="badge pend">${method}</span></span><span>\u23F1 ${ms||'-'}ms</span>`;
  apiDot.className='dot pending';
}
function setApiRes(status,data,ms){
  $('resCode').innerHTML=syntaxHL(data);
  const ok=status>=200&&status<300;
  $('resMeta').innerHTML=`<span><span class="badge ${ok?'ok':'err'}">${status}</span></span><span>\u23F1 ${ms}ms</span>`;
  apiDot.className='dot '+(ok?'ok':'err');
}
function setApiPoll(attempts,taskId,finalStatus,data){
  $('pollCode').innerHTML=syntaxHL({task_id:taskId,attempts,final_status:finalStatus,result:data});
  $('pollMeta').innerHTML=`<span>&#128260; ${attempts} \u6B21\u8F2A\u8A62</span><span><span class="badge ${finalStatus==='completed'||finalStatus==='success'?'ok':'err'}">${finalStatus}</span></span>`;
}
function copyCode(id){
  navigator.clipboard.writeText($(''+id).textContent);
}

function showStatus(type,msg){statusMsg.className='status '+type;statusMsg.textContent=(type==='error'?'\u274C ':'\u2705 ')+msg;}
function startProg(lbl){progWrap.classList.add('show');progLbl.textContent=lbl||'...';let p=0;progFill.style.width='0%';progTimer=setInterval(()=>{p=Math.min(p+(p<55?2.5:p<80?1:0.3),94);progFill.style.width=p+'%';},700);}
function endProg(){clearInterval(progTimer);progFill.style.width='100%';setTimeout(()=>progWrap.classList.remove('show'),700);}
function setLoad(on){genBtn.disabled=on;genBtn.classList.toggle('loading',on);if(on)startProg('正在送出請求...');else endProg();}

function buildCard(src,prompt,revised){
  const card=document.createElement('div');card.className='result-card';
  const img=document.createElement('img');img.src=src;img.className='result-img';img.alt='';img.onclick=()=>openLb(src);card.appendChild(img);
  const meta=document.createElement('div');meta.className='result-meta';
  const p=document.createElement('p');p.className='result-prompt-txt';p.textContent=(revised?'\uD83E\uDD16 '+revised:'\uD83D\uDCDD '+prompt);meta.appendChild(p);
  const acts=document.createElement('div');acts.className='result-actions';
  const dl=document.createElement('a');dl.className='act-btn primary';dl.href=src;dl.download='kio-'+Date.now()+'.png';dl.innerHTML='\u2B07\uFE0F \u4E0B\u8F09';acts.appendChild(dl);
  const cp=document.createElement('button');cp.className='act-btn secondary';cp.innerHTML='\uD83D\uDCCB \u8907\u88FD URL';cp.onclick=()=>{navigator.clipboard.writeText(src);cp.textContent='\u2705 \u5DF2\u8907\u88FD';setTimeout(()=>cp.innerHTML='\uD83D\uDCCB \u8907\u88FD URL',2000);};acts.appendChild(cp);
  const lb=document.createElement('button');lb.className='act-btn secondary';lb.innerHTML='\uD83D\uDD0D \u5168\u87A2\u5E55';lb.onclick=()=>openLb(src);acts.appendChild(lb);
  meta.appendChild(acts);card.appendChild(meta);return card;
}
function saveHist(src,prompt){hist.unshift({src,prompt,ts:Date.now()});if(hist.length>20)hist=hist.slice(0,20);localStorage.setItem('kio_h',JSON.stringify(hist));renderHist();}
function renderHist(){if(hist.length<=1)return;histSec.style.display='block';histGrid.innerHTML='';hist.slice(1).forEach(item=>{const t=document.createElement('div');t.className='hist-thumb';const i=document.createElement('img');i.src=item.src;const ov=document.createElement('div');ov.className='hist-ov';ov.textContent='\uD83D\uDD0D';t.appendChild(i);t.appendChild(ov);t.onclick=()=>openLb(item.src);histGrid.appendChild(t);});}
function openLb(src){lbImg.src=src;lightbox.classList.add('show');}
$('lbClose').onclick=()=>lightbox.classList.remove('show');
lightbox.onclick=e=>{if(e.target===lightbox)lightbox.classList.remove('show');};

async function generate(){
  const prompt=promptEl.value.trim(),model=modelEl.value,size=selectedSize;
  if(!prompt){showStatus('error','\u8ACB\u8F38\u5165\u5716\u50CF\u63CF\u8FF0');return;}
  statusMsg.className='status';setLoad(true);
  // open panel
  if(!panelOpen){panelOpen=true;apiPanel.classList.add('open');apiTabs.style.display='flex';}
  const reqBody={prompt,model,size,n:1};
  const reqUrl=window.location.origin+'/v1/images/generations';
  const t0=Date.now();
  setApiReq(reqUrl,'POST',reqBody,null);
  try{
    progLbl.textContent='\u6B63\u5728\u9001\u51FA\u8ACB\u6C42...';
    const res=await fetch('/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(reqBody)});
    const t1=Date.now()-t0;
    const data=await res.json();
    setApiRes(res.status,data,t1);
    // switch to response tab
    document.querySelectorAll('.api-tab').forEach(t=>t.classList.remove('active'));
    document.querySelector('.api-tab[data-tab="res"]').classList.add('active');
    activeTab='res';$('tabReq').style.display='none';$('tabRes').style.display='block';$('tabPoll').style.display='none';
    if(!res.ok)throw new Error(data?.error?.message||'HTTP '+res.status);
    const item=data?.data?.[0];
    // show poll info if present
    if(item?.task_id||item?._poll_attempts){
      setApiPoll(item._poll_attempts||'?',item.task_id||'-',item._poll_status||'completed',item);
    }
    if(!item)throw new Error('\u56DE\u61C9\u4E2D\u672A\u627E\u5230\u5716\u50CF\u6578\u64DA');
    const imgSrc=item.url||(item.b64_json?'data:image/png;base64,'+item.b64_json:null);
    if(!imgSrc){showStatus('error','\u7121\u6CD5\u89E3\u6790\u5716\u50CF URL');return;}
    emptyState.style.display='none';latestResult.style.display='block';latestResult.innerHTML='';
    latestResult.appendChild(buildCard(imgSrc,prompt,item.revised_prompt||null));
    saveHist(imgSrc,prompt);showStatus('success','\u5716\u50CF\u751F\u6210\u6210\u529F\uFF01');
  }catch(err){
    apiDot.className='dot err';
    showStatus('error',err.message);
  }finally{setLoad(false);}
}
$('genBtn').onclick=generate;
promptEl.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();generate();}});
if(hist.length>0){const l=hist[0];emptyState.style.display='none';latestResult.style.display='block';latestResult.appendChild(buildCard(l.src,l.prompt,null));renderHist();}
<\/script>
</body></html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-api-key',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    const SUPABASE_URL = 'https://gjosebfngzowbcrwzxnw.supabase.co/functions/v1';
    const API_KEY      = env.MEDO_API_KEY || 'nb_SBa89oD7xBbHSrwJKny3acDF6kRFuPBNgF2BEEDTdnRGMyBe';
    const SUPA_ANON    = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3NlYmZuZ3pvd2Jjcnd6eG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzA0MjcsImV4cCI6MjA4NzgwNjQyN30.OlsHb4DZmv22j9FZ1h8pj2tvFnKlS0hsxJJW1NMxR4E';

    const json = (d, s = 200) => new Response(JSON.stringify(d), {
      status: s, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

    const apiHdr = () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'apikey': SUPA_ANON,
    });
    const pollHdr = () => ({
      'Authorization': `Bearer ${API_KEY}`,
      'apikey': SUPA_ANON,
    });

    async function submitTask(body) {
      const r = await fetch(`${SUPABASE_URL}/openai-compatible`, {
        method: 'POST', headers: apiHdr(), body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`openai-compatible ${r.status}: ${await r.text()}`);
      return r.json();
    }

    async function pollUntilDone(taskId, maxWait = 120000, interval = 3000) {
      const deadline = Date.now() + maxWait;
      let attempt = 0;
      while (Date.now() < deadline) {
        attempt++;
        await new Promise(r => setTimeout(r, interval));
        const r = await fetch(`${SUPABASE_URL}/get-task-result?task_id=${taskId}`, { headers: pollHdr() });
        if (!r.ok) continue;
        const d = await r.json();
        const st = d.status || d.state || d.task_status;
        console.log(`[KIO] Poll #${attempt} task=${taskId} status=${st}`);
        if (st === 'completed' || st === 'done' || st === 'success') return { data: d, attempts: attempt, status: st };
        if (st === 'failed' || st === 'error') throw new Error(d.error || d.message || 'Task failed');
      }
      throw new Error(`Task ${taskId} timeout after ${maxWait / 1000}s`);
    }

    function extractImg(r) {
      return r.image_url || r.url || r.output_url
        || r.output?.url || r.result?.url || r.result?.image_url
        || (Array.isArray(r.images) ? r.images[0] : null)
        || (Array.isArray(r.data) ? (r.data[0]?.url || r.data[0]?.image_url) : null)
        || null;
    }
    function extractB64(r) { return r.b64_json || r.base64 || r.result?.b64_json || null; }

    try {
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html'))
        return new Response(HTML_UI, { headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache' } });

      if (request.method === 'GET' && url.pathname === '/health')
        return json({ status: 'ok', version: '4.2.0', sizes: ['1K','2K','4K'], auth: 'api-key' });

      if (request.method === 'GET' && url.pathname === '/v1/models')
        return json({ object: 'list', data: [
          { id: 'gemini-3.1-pro-preview', object: 'model', owned_by: 'medo' },
          { id: 'medo-image',             object: 'model', owned_by: 'medo' },
          { id: 'dall-e-3',              object: 'model', owned_by: 'openai' },
        ]});

      if (request.method === 'POST' &&
         (url.pathname === '/v1/images/generations' || url.pathname === '/v1/images/generate')) {

        const body = await request.json();
        const { prompt, model = 'gemini-3.1-pro-preview', n = 1, size = '1024x1024',
                quality = 'standard', style = 'vivid', response_format = 'url', ...extra } = body;

        if (!prompt) return json({ error: { message: 'prompt is required' } }, 400);

        // 記錄請求資訊
        const requestInfo = { prompt, model, n, size, quality, style, endpoint: `${SUPABASE_URL}/openai-compatible` };
        const t0 = Date.now();

        const submitResp = await submitTask({ prompt, model, n, size, quality, style, response_format, ...extra });
        const submitMs = Date.now() - t0;

        console.log('[KIO] submit:', JSON.stringify(submitResp).slice(0, 400));

        // 同步回傳
        const dImg = extractImg(submitResp);
        const dB64 = extractB64(submitResp);
        if (dImg || dB64) {
          return json({
            created: Math.floor(Date.now()/1000),
            _debug: { request: requestInfo, submit_ms: submitMs, mode: 'sync' },
            data: [{ ...(dImg?{url:dImg}:{}), ...(dB64?{b64_json:dB64}:{}), revised_prompt: submitResp.revised_prompt || prompt }],
          });
        }

        // 取 task_id
        const taskId =
          submitResp.data?.[0]?.task_id ||
          submitResp.task_id || submitResp.id ||
          submitResp.job_id  || submitResp.request_id;

        if (!taskId) {
          return json({
            created: Math.floor(Date.now()/1000),
            warning: 'Unknown upstream format — no task_id found',
            _debug: { request: requestInfo, submit_response: submitResp },
            data: [{ _raw: submitResp }],
          });
        }

        console.log(`[KIO] task_id=${taskId}, polling...`);

        // 輪詢
        const { data: pollData, attempts, status: pollStatus } = await pollUntilDone(taskId);
        const totalMs = Date.now() - t0;
        const imgUrl  = extractImg(pollData);
        const b64     = extractB64(pollData);

        return json({
          created: Math.floor(Date.now()/1000),
          _debug: {
            request:     requestInfo,
            submit_ms:   submitMs,
            total_ms:    totalMs,
            mode:        'async',
            task_id:     taskId,
            poll_attempts: attempts,
            poll_status: pollStatus,
            raw_poll:    pollData,
          },
          data: [{
            ...(imgUrl ? { url: imgUrl } : {}),
            ...(b64    ? { b64_json: b64 } : {}),
            revised_prompt: pollData.revised_prompt || pollData.enhanced_prompt || prompt,
            task_id: taskId,
            _poll_attempts: attempts,
            _poll_status:   pollStatus,
          }],
        });
      }

      return json({ error: { message: `Not found: ${request.method} ${url.pathname}` }, ui: '/' }, 404);

    } catch (err) {
      console.error('[KIO] Error:', err.stack || err.message);
      return json({ error: { message: err.message || 'Internal server error' }, _debug: { stack: err.stack } }, 500);
    }
  },
};
