/**
 * KIO Gateway v4.0 - OpenAI Compatible API + Built-in UI
 * Backend: gjosebfngzowbcrwzxnw.supabase.co/functions/v1/openai-compatible
 * Flow: POST /openai-compatible → get task_id → poll /get-task-result
 */

const HTML_UI = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KIO Gateway - Image Generator</title>
<style>
:root{--bg:#0f0f13;--surface:#1a1a24;--surface2:#22222f;--border:#2e2e3e;--accent:#7c6fff;--accent2:#00d2ff;--text:#e8e8f0;--text2:#888899;--success:#22c55e;--error:#ef4444;--radius:14px;}
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.app{display:grid;grid-template-columns:340px 1fr;min-height:100vh;}
@media(max-width:800px){.app{grid-template-columns:1fr;}.sidebar{border-right:none;border-bottom:1px solid var(--border);}}
.sidebar{background:var(--surface);border-right:1px solid var(--border);padding:28px 22px;display:flex;flex-direction:column;gap:20px;overflow-y:auto;}
.logo{display:flex;align-items:center;gap:10px;margin-bottom:4px;}
.logo-icon{width:38px;height:38px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
.logo h1{font-size:1.3rem;font-weight:700;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.logo small{font-size:0.72rem;color:var(--text2);display:block;-webkit-text-fill-color:var(--text2);}
.section-label{font-size:0.7rem;font-weight:700;letter-spacing:.1em;color:var(--text2);text-transform:uppercase;margin-bottom:6px;}
.field{display:flex;flex-direction:column;gap:6px;}
.field label{font-size:0.82rem;color:var(--text2);font-weight:500;}
input[type=text],select,textarea{background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.88rem;padding:9px 12px;width:100%;outline:none;transition:border-color .2s;font-family:inherit;}
input[type=text]:focus,select:focus,textarea:focus{border-color:var(--accent);}
select option{background:var(--surface2);}
textarea#prompt{min-height:110px;resize:vertical;line-height:1.6;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.generate-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:var(--radius);color:#fff;font-size:0.95rem;font-weight:700;padding:13px;cursor:pointer;width:100%;transition:opacity .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:8px;}
.generate-btn:hover{opacity:.9;transform:translateY(-1px);}
.generate-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.generate-btn .btn-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none;}
.generate-btn.loading .btn-spinner{display:block;}
.generate-btn.loading .btn-text{display:none;}
@keyframes spin{to{transform:rotate(360deg);}}
.progress-wrap{display:none;}
.progress-wrap.show{display:block;}
.progress-label{font-size:0.75rem;color:var(--text2);margin-bottom:6px;}
.progress-bar{height:4px;background:var(--border);border-radius:99px;overflow:hidden;}
.progress-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px;transition:width .4s ease;animation:pulse-bar 1.5s ease-in-out infinite;}
@keyframes pulse-bar{0%,100%{opacity:1}50%{opacity:.6}}
.status{display:none;padding:10px 13px;border-radius:8px;font-size:0.82rem;margin-top:4px;}
.status.error{display:flex;gap:8px;background:rgba(239,68,68,.12);color:var(--error);border:1px solid rgba(239,68,68,.2);}
.status.success{display:flex;gap:8px;background:rgba(34,197,94,.1);color:var(--success);border:1px solid rgba(34,197,94,.2);}
.main{padding:28px;display:flex;flex-direction:column;gap:28px;overflow-y:auto;}
.empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--text2);text-align:center;padding:60px 20px;}
.empty-state .icon{font-size:4rem;opacity:.3;}
.empty-state h2{font-size:1.1rem;color:var(--text2);font-weight:500;}
.empty-state p{font-size:0.82rem;max-width:260px;line-height:1.6;}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;animation:fadeUp .4s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.result-img{width:100%;display:block;cursor:pointer;transition:transform .2s;}
.result-img:hover{transform:scale(1.005);}
.result-meta{padding:16px 18px;display:flex;flex-direction:column;gap:8px;}
.result-prompt{font-size:0.82rem;color:var(--text2);line-height:1.55;}
.result-actions{display:flex;gap:10px;flex-wrap:wrap;}
.act-btn{padding:7px 16px;border-radius:8px;font-size:0.8rem;font-weight:600;cursor:pointer;border:none;transition:background .15s;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}
.act-btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;}
.act-btn.secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border);}
.act-btn:hover{opacity:.85;}
.history-section h2{font-size:0.8rem;font-weight:700;letter-spacing:.08em;color:var(--text2);text-transform:uppercase;margin-bottom:14px;}
.history-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;}
.history-thumb{border-radius:10px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .2s,transform .15s;position:relative;aspect-ratio:1;background:var(--surface);}
.history-thumb:hover{border-color:var(--accent);transform:scale(1.03);}
.history-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.history-thumb .thumb-overlay{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center;font-size:1.4rem;}
.history-thumb:hover .thumb-overlay{opacity:1;}
.lightbox{display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.88);align-items:center;justify-content:center;}
.lightbox.show{display:flex;}
.lightbox img{max-width:90vw;max-height:90vh;border-radius:12px;}
.lightbox-close{position:fixed;top:20px;right:24px;background:rgba(255,255,255,.1);border:none;color:#fff;width:40px;height:40px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-icon">&#127912;</div>
      <div><h1>KIO Gateway</h1><small>medo image generator</small></div>
    </div>
    <div>
      <div class="section-label">&#128221; &#22294;&#20687;&#25551;&#36848;</div>
      <div class="field">
        <label>Prompt <span style="color:var(--text2);font-weight:400">(Ctrl+Enter &#25552;&#20132;)</span></label>
        <textarea id="prompt" placeholder="&#19968;&#38500;&#27792;&#33394;&#29483;&#21307;&#22312;&#38695;&#32418;&#37117;&#24066;&#30340;&#23627;&#39302;&#65292;&#36093;&#21338;&#37504;&#20811;&#39118;&#26684;&#65292;&#38590;&#24425;&#20809;&#24433;&#65292;8K &#36229;&#39640;&#28165;"></textarea>
      </div>
    </div>
    <div>
      <div class="section-label">&#9881;&#65039; &#21443;&#25976;&#35373;&#23450;</div>
      <div class="field"><label>&#27169;&#22411;</label>
        <select id="model">
          <option value="gemini-3.1-pro-preview" selected>gemini-3.1-pro-preview</option>
          <option value="medo-image">medo-image</option>
          <option value="dall-e-3">DALL-E 3</option>
        </select>
      </div>
      <div class="field" style="margin-top:10px"><label>&#23610;&#23544;</label>
        <select id="size">
          <option value="1024x1024">1:1 &#27491;&#26041;&#24418; (1024&#215;1024)</option>
          <option value="1024x1792">9:16 &#35611;&#21521; (1024&#215;1792)</option>
          <option value="1792x1024">16:9 &#6a6b;&#21521; (1792&#215;1024)</option>
        </select>
      </div>
    </div>
    <div class="progress-wrap" id="progressWrap">
      <div class="progress-label" id="progressLabel">&#27491;&#22312;&#29983;&#25104;&#22294;&#20687;...</div>
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    </div>
    <button class="generate-btn" id="generateBtn" type="button">
      <span class="btn-text">&#10024; &#29983;&#25104;&#22294;&#20687;</span>
      <div class="btn-spinner"></div>
    </button>
    <div class="status" id="statusMsg"></div>
  </aside>
  <main class="main" id="main">
    <div class="empty-state" id="emptyState">
      <div class="icon">&#128444;&#65039;</div>
      <h2>&#23609;&#26410;&#29983;&#25104;&#20219;&#20309;&#22294;&#20687;</h2>
      <p>&#22312;&#24038;&#20491;&#22577;&#20837;&#25551;&#36848;&#19988;&#40670;&#64277;&#12300;&#29983;&#25104;&#22294;&#20687;&#12301;&#65292;&#32080;&#26524;&#23559;&#39023;&#31034;&#22312;&#36889;&#35069;</p>
    </div>
    <div id="latestResult" style="display:none"></div>
    <div class="history-section" id="historySection" style="display:none">
      <h2>&#128344; &#27511;&#21490;&#32000;&#37636;</h2>
      <div class="history-grid" id="historyGrid"></div>
    </div>
  </main>
</div>
<div class="lightbox" id="lightbox">
  <button class="lightbox-close" id="lightboxClose">&#10005;</button>
  <img id="lightboxImg" src="" alt="">
</div>
<script>
let history=JSON.parse(localStorage.getItem('kio_history')||'[]');let progressTimer=null;
const $=id=>document.getElementById(id);
const promptEl=$('prompt'),modelEl=$('model'),sizeEl=$('size');
const generateBtn=$('generateBtn'),statusMsg=$('statusMsg'),progressWrap=$('progressWrap');
const progressFill=$('progressFill'),progressLbl=$('progressLabel'),emptyState=$('emptyState');
const latestResult=$('latestResult'),historySection=$('historySection'),historyGrid=$('historyGrid');
const lightbox=$('lightbox'),lightboxImg=$('lightboxImg');
function showStatus(type,msg){statusMsg.className='status '+type;statusMsg.textContent=(type==='error'?'\u274c ':'\u2705 ')+msg;}
function startProgress(label){progressWrap.classList.add('show');progressLbl.textContent=label||'\u6b63\u5728\u63d0\u4ea4...';let pct=0;progressFill.style.width='0%';progressTimer=setInterval(()=>{pct=Math.min(pct+(pct<60?2:pct<85?0.8:0.2),95);progressFill.style.width=pct+'%';},600);}
function finishProgress(){clearInterval(progressTimer);progressFill.style.width='100%';setTimeout(()=>progressWrap.classList.remove('show'),600);}
function setLoading(on){generateBtn.disabled=on;generateBtn.classList.toggle('loading',on);if(on)startProgress();else finishProgress();}
function buildCard(imgSrc,prompt,revised){
  const card=document.createElement('div');card.className='result-card';
  const img=document.createElement('img');img.src=imgSrc;img.className='result-img';img.alt='Generated';img.addEventListener('click',()=>openLightbox(imgSrc));card.appendChild(img);
  const meta=document.createElement('div');meta.className='result-meta';
  const pEl=document.createElement('p');pEl.className='result-prompt';pEl.textContent=(revised?'\ud83e\udd16 '+revised:'\ud83d\udcdd '+prompt);meta.appendChild(pEl);
  const actions=document.createElement('div');actions.className='result-actions';
  const dl=document.createElement('a');dl.className='act-btn primary';dl.href=imgSrc;dl.download='kio-'+Date.now()+'.png';dl.innerHTML='\u2b07\ufe0f \u4e0b\u8f09';actions.appendChild(dl);
  const cp=document.createElement('button');cp.className='act-btn secondary';cp.innerHTML='\ud83d\udccb \u8907\u88fd';cp.onclick=()=>{navigator.clipboard.writeText(imgSrc);cp.textContent='\u2705 \u5df2\u8907\u88fd';setTimeout(()=>cp.innerHTML='\ud83d\udccb \u8907\u88fd',2000);};actions.appendChild(cp);
  const lb=document.createElement('button');lb.className='act-btn secondary';lb.innerHTML='\ud83d\udd0d \u5168\u87a2\u5e55';lb.onclick=()=>openLightbox(imgSrc);actions.appendChild(lb);
  meta.appendChild(actions);card.appendChild(meta);return card;
}
function saveHistory(src,prompt){history.unshift({src,prompt,ts:Date.now()});if(history.length>20)history=history.slice(0,20);localStorage.setItem('kio_history',JSON.stringify(history));renderHistory();}
function renderHistory(){if(history.length<=1)return;historySection.style.display='block';historyGrid.innerHTML='';history.slice(1).forEach(item=>{const thumb=document.createElement('div');thumb.className='history-thumb';const img=document.createElement('img');img.src=item.src;const ov=document.createElement('div');ov.className='thumb-overlay';ov.textContent='\ud83d\udd0d';thumb.appendChild(img);thumb.appendChild(ov);thumb.addEventListener('click',()=>openLightbox(item.src));historyGrid.appendChild(thumb);});}
function openLightbox(src){lightboxImg.src=src;lightbox.classList.add('show');}
$('lightboxClose').onclick=()=>lightbox.classList.remove('show');
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.classList.remove('show');});
async function generate(){
  const prompt=promptEl.value.trim(),model=modelEl.value,size=sizeEl.value;
  if(!prompt){showStatus('error','\u8acb\u8f38\u5165\u5716\u50cf\u63cf\u8ff0');return;}
  statusMsg.className='status';setLoading(true);
  try{
    progressLbl.textContent='\u6b63\u5728\u9001\u51fa\u8acb\u6c42...';
    const res=await fetch('/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,model,size,n:1})});
    if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+res.status);}
    const data=await res.json();
    const item=data?.data?.[0];
    if(!item)throw new Error('\u56de\u61c9\u4e2d\u672a\u627e\u5230\u5716\u50cf');
    let imgSrc=item.url||(item.b64_json?'data:image/png;base64,'+item.b64_json:null);
    if(!imgSrc)throw new Error('\u7121\u6cd5\u89e3\u6790\u5716\u50cf\u6578\u64da');
    emptyState.style.display='none';latestResult.style.display='block';latestResult.innerHTML='';
    latestResult.appendChild(buildCard(imgSrc,prompt,item.revised_prompt||null));
    saveHistory(imgSrc,prompt);showStatus('success','\u5716\u50cf\u751f\u6210\u6210\u529f\uff01');
  }catch(err){showStatus('error',err.message);}
  finally{setLoading(false);}
}
generateBtn.addEventListener('click',generate);
promptEl.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();generate();}});
if(history.length>0){const last=history[0];emptyState.style.display='none';latestResult.style.display='block';latestResult.appendChild(buildCard(last.src,last.prompt,null));renderHistory();}
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

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── Supabase 設定 ──────────────────────────────────────────────
    const SUPABASE_URL   = 'https://gjosebfngzowbcrwzxnw.supabase.co/functions/v1';
    const SUPABASE_ANON  = env.SUPABASE_ANON_KEY  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3NlYmZuZ3pvd2Jjcnd6eG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzA0MjcsImV4cCI6MjA4NzgwNjQyN30.OlsHb4DZmv22j9FZ1h8pj2tvFnKlS0hsxJJW1NMxR4E';
    const SUPABASE_TOKEN = env.SUPABASE_AUTH_TOKEN || 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImI0OWQ3OTkyLTI0NDItNDE3ZS05MzAxLTIzNzk1ZjE3NTJjNyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2dqb3NlYmZuZ3pvd2Jjcnd6eG53LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkYjI3NjI1Yi01ZjRjLTRjZjktYWE4MS01OTJkZmYyOTM3N2YiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc0MzY0MTc2LCJpYXQiOjE3NzQzNjA1NzYsImVtYWlsIjoia2luZXM5NjYxNzZAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJzc286ZDkwZGM1ZTItMTdjNS00NGY1LWJjMjUtMWFmN2ZjZmJmZTQ1IiwicHJvdmlkZXJzIjpbInNzbzpkOTBkYzVlMi0xN2M1LTQ0ZjUtYmMyNS0xYWY3ZmNmYmZlNDUiXX0sInVzZXJfbWV0YWRhdGEiOnsiY3VzdG9tX2NsYWltcyI6e30sImVtYWlsIjoia2luZXM5NjYxNzZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vbWVkby5kZXYvZ29vZ2xlX21ldGFkYXRhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJraW5lczk2NjE3NkBnbWFpbC5jb20ifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJzc28vc2FtbCIsInRpbWVzdGFtcCI6MTc3MjkwOTUyNSwicHJvdmlkZXIiOiJkOTBkYzVlMi0xN2M1LTQ0ZjUtYmMyNS0xYWY3ZmNmYmZlNDUifV0sInNlc3Npb25faWQiOiIzNTAxZjQ3NS0wMzEyLTQ3MTctYTU2YS1kN2ZlZWMzZDBkNTAiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.bV3Q6DZAtxT_ETsiM0gLFPXiKTqKxPoH1czwlANF6EyQ7C98E_UwwGJZ0oT7Sai0OT_m4kpW8bypPkfquWuI5A';

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    const supaHeaders = () => ({
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_TOKEN}`,
    });

    // ── Step 1: 呼叫 openai-compatible 送出任務 ────────────────────
    async function submitToOpenAICompat(body) {
      const res = await fetch(`${SUPABASE_URL}/openai-compatible`, {
        method: 'POST',
        headers: supaHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`openai-compatible failed: ${res.status} ${err}`);
      }
      return res.json();
    }

    // ── Step 2: 輪詢 get-task-result 直到完成 ─────────────────────
    async function pollUntilDone(taskId, maxWait = 120000, interval = 3000) {
      const deadline = Date.now() + maxWait;
      let attempt = 0;
      while (Date.now() < deadline) {
        attempt++;
        await new Promise(r => setTimeout(r, interval));
        const res = await fetch(`${SUPABASE_URL}/get-task-result?task_id=${taskId}`, {
          headers: supaHeaders(),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const status = data.status || data.state || data.task_status;
        console.log(`Poll #${attempt} task_id=${taskId} status=${status}`);

        if (status === 'completed' || status === 'done' || status === 'success') return data;
        if (status === 'failed' || status === 'error') {
          throw new Error(data.error || data.message || 'Task failed');
        }
        // 仍是 pending/processing，繼續等
      }
      throw new Error(`Task ${taskId} timeout after ${maxWait/1000}s`);
    }

    // ── 從任意格式結果中取出圖像 URL ──────────────────────────────
    function extractImage(result) {
      return result.image_url
        || result.url
        || result.output_url
        || result.output?.url
        || result.result?.url
        || result.result?.image_url
        || (Array.isArray(result.images) ? result.images[0] : null)
        || (Array.isArray(result.data) ? result.data[0]?.url || result.data[0]?.image_url : null)
        || null;
    }

    function extractB64(result) {
      return result.b64_json || result.base64 || result.result?.b64_json || null;
    }

    try {

      // ── GET / → UI ──────────────────────────────────────────────
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
        return new Response(HTML_UI, {
          headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache' },
        });
      }

      // ── GET /health ─────────────────────────────────────────────
      if (request.method === 'GET' && url.pathname === '/health') {
        return json({ status: 'ok', service: 'kio-gateway', version: '4.0.0', backend: 'openai-compatible', ui: '/' });
      }

      // ── GET /v1/models ──────────────────────────────────────────
      if (request.method === 'GET' && url.pathname === '/v1/models') {
        return json({ object: 'list', data: [
          { id: 'gemini-3.1-pro-preview', object: 'model', created: 1700000000, owned_by: 'medo' },
          { id: 'medo-image',             object: 'model', created: 1700000000, owned_by: 'medo' },
          { id: 'dall-e-3',              object: 'model', created: 1700000000, owned_by: 'openai' },
        ]});
      }

      // ── POST /v1/images/generations ─────────────────────────────
      //    核心邏輯：送出 → 取 task_id → 輪詢 → 回傳圖像
      if (request.method === 'POST' &&
         (url.pathname === '/v1/images/generations' || url.pathname === '/v1/images/generate')) {

        const body = await request.json();
        const {
          prompt,
          model           = 'gemini-3.1-pro-preview',
          n               = 1,
          size            = '1024x1024',
          quality         = 'standard',
          style           = 'vivid',
          response_format = 'url',
          ...extra
        } = body;

        if (!prompt) {
          return json({ error: { message: 'prompt is required', type: 'invalid_request_error' } }, 400);
        }

        // 送出到 openai-compatible
        const submitResp = await submitToOpenAICompat({ prompt, model, n, size, quality, style, response_format, ...extra });

        // 如果直接回傳了圖像（同步模式）
        const directImg = extractImage(submitResp);
        const directB64 = extractB64(submitResp);
        if (directImg || directB64) {
          return json({
            created: Math.floor(Date.now() / 1000),
            data: [{
              ...(directImg ? { url: directImg } : {}),
              ...(directB64 ? { b64_json: directB64 } : {}),
              revised_prompt: submitResp.revised_prompt || prompt,
            }],
          });
        }

        // 非同步模式：取 task_id 然後輪詢
        const taskId =
          submitResp.data?.[0]?.task_id
          || submitResp.task_id
          || submitResp.id
          || submitResp.job_id
          || submitResp.request_id;

        if (!taskId) {
          // 無法識別，原樣回傳供 debug
          return json({ created: Math.floor(Date.now()/1000), data: [{ _raw: submitResp }], warning: 'Unknown upstream format' });
        }

        // 輪詢直到完成
        const result = await pollUntilDone(taskId);
        const imgUrl = extractImage(result);
        const b64    = extractB64(result);

        return json({
          created: Math.floor(Date.now() / 1000),
          data: [{
            ...(imgUrl ? { url: imgUrl } : {}),
            ...(b64   ? { b64_json: b64 } : {}),
            revised_prompt: result.revised_prompt || result.enhanced_prompt || prompt,
            task_id: taskId,
          }],
        });
      }

      // ── 404 ─────────────────────────────────────────────────────
      return json({
        error: { message: `Not found: ${request.method} ${url.pathname}` },
        ui: '/',
        routes: ['GET /', 'GET /health', 'GET /v1/models', 'POST /v1/images/generations'],
      }, 404);

    } catch (error) {
      console.error('Worker Error:', error.stack || error.message);
      return json({ error: { message: error.message || 'Internal server error', type: 'api_error' } }, 500);
    }
  },
};
