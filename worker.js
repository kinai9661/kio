/**
 * KIO Gateway v4.3
 * + Custom API Key (localStorage, sent via X-User-Api-Key header)
 * + EN / ZH language toggle
 */

const HTML_UI = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KIO Gateway - Image Generator</title>
<style>
:root{--bg:#0f0f13;--surface:#1a1a24;--surface2:#22222f;--border:#2e2e3e;--accent:#7c6fff;--accent2:#00d2ff;--text:#e8e8f0;--text2:#888899;--success:#22c55e;--error:#ef4444;--warn:#f59e0b;--radius:14px;}
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.app{display:grid;grid-template-columns:370px 1fr;min-height:100vh;}
@media(max-width:860px){.app{grid-template-columns:1fr;}.sidebar{border-right:none;border-bottom:1px solid var(--border);}}
.sidebar{background:var(--surface);border-right:1px solid var(--border);padding:20px 18px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}
.logo-row{display:flex;align-items:center;justify-content:space-between;}
.logo{display:flex;align-items:center;gap:9px;}
.logo-icon{width:34px;height:34px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.logo h1{font-size:1.1rem;font-weight:700;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.logo small{font-size:0.65rem;color:var(--text2);display:block;-webkit-text-fill-color:var(--text2);}
.lang-btn{background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text2);font-size:0.72rem;font-weight:700;padding:4px 10px;cursor:pointer;letter-spacing:.05em;transition:all .15s;}
.lang-btn:hover{border-color:var(--accent);color:var(--accent);}
.sec-label{font-size:0.67rem;font-weight:700;letter-spacing:.1em;color:var(--text2);text-transform:uppercase;margin-bottom:4px;}
.field{display:flex;flex-direction:column;gap:4px;}
.field label{font-size:0.78rem;color:var(--text2);font-weight:500;}
input,select,textarea{background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.85rem;padding:8px 11px;width:100%;outline:none;transition:border-color .2s;font-family:inherit;}
input:focus,select:focus,textarea:focus{border-color:var(--accent);}
select option{background:var(--surface2);}
textarea#prompt{min-height:90px;resize:vertical;line-height:1.6;}
/* API Key field */
.apikey-wrap{position:relative;}
.apikey-wrap input{padding-right:68px;font-family:'SF Mono','Fira Code',monospace;font-size:0.78rem;letter-spacing:.02em;}
.apikey-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text2);cursor:pointer;font-size:0.7rem;padding:2px 5px;}
.apikey-toggle:hover{color:var(--text);}
.apikey-status{font-size:0.68rem;margin-top:3px;}
.apikey-status.custom{color:var(--success);}
.apikey-status.default{color:var(--text2);}
/* Size grid */
.size-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;}
.size-btn{background:var(--surface2);border:1px solid var(--border);border-radius:7px;color:var(--text2);font-size:0.7rem;font-weight:600;padding:6px 3px;cursor:pointer;text-align:center;transition:all .15s;line-height:1.3;}
.size-btn:hover{border-color:var(--accent);color:var(--text);}
.size-btn.active{border-color:var(--accent);background:rgba(124,111,255,.15);color:var(--accent);}
.size-btn .ratio{font-size:0.62rem;color:var(--text2);display:block;margin-top:2px;}
.size-btn.active .ratio{color:var(--accent);opacity:.7;}
/* Generate btn */
.gen-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:var(--radius);color:#fff;font-size:0.9rem;font-weight:700;padding:12px;cursor:pointer;width:100%;transition:opacity .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:8px;}
.gen-btn:hover{opacity:.9;transform:translateY(-1px);}
.gen-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.gen-btn .spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none;}
.gen-btn.loading .spin{display:block;}
.gen-btn.loading .btn-txt{display:none;}
@keyframes spin{to{transform:rotate(360deg);}}
.prog-wrap{display:none;}
.prog-wrap.show{display:block;}
.prog-lbl{font-size:0.7rem;color:var(--text2);margin-bottom:4px;}
.prog-bar{height:3px;background:var(--border);border-radius:99px;overflow:hidden;}
.prog-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px;transition:width .4s ease;}
.status{display:none;padding:8px 11px;border-radius:8px;font-size:0.78rem;margin-top:2px;}
.status.error{display:flex;gap:6px;background:rgba(239,68,68,.12);color:var(--error);border:1px solid rgba(239,68,68,.2);}
.status.success{display:flex;gap:6px;background:rgba(34,197,94,.1);color:var(--success);border:1px solid rgba(34,197,94,.2);}
/* API panel */
.api-panel{background:var(--surface2);border:1px solid var(--border);border-radius:9px;overflow:hidden;}
.api-panel-header{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;cursor:pointer;user-select:none;border-bottom:1px solid transparent;}
.api-panel-header:hover{background:rgba(255,255,255,.03);}
.api-panel.open .api-panel-header{border-bottom-color:var(--border);}
.api-panel-title{font-size:0.72rem;font-weight:700;color:var(--text2);display:flex;align-items:center;gap:6px;}
.api-panel-title .dot{width:7px;height:7px;border-radius:50%;background:var(--border);}
.api-panel-title .dot.ok{background:var(--success);}
.api-panel-title .dot.err{background:var(--error);}
.api-panel-title .dot.pending{background:var(--warn);animation:blink 1s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.api-chevron{font-size:0.68rem;color:var(--text2);transition:transform .2s;}
.api-panel.open .api-chevron{transform:rotate(180deg);}
.api-tabs{display:flex;border-bottom:1px solid var(--border);}
.api-tab{flex:1;padding:7px;font-size:0.7rem;font-weight:600;color:var(--text2);cursor:pointer;text-align:center;border-bottom:2px solid transparent;transition:all .15s;}
.api-tab.active{color:var(--accent);border-bottom-color:var(--accent);}
.api-body{display:none;padding:10px 12px;}
.api-panel.open .api-body{display:block;}
.api-meta{font-size:0.68rem;color:var(--text2);margin-bottom:6px;display:flex;gap:10px;flex-wrap:wrap;}
.api-meta span{display:flex;align-items:center;gap:4px;}
.api-meta .badge{background:var(--surface);padding:2px 6px;border-radius:99px;font-size:0.63rem;font-weight:700;}
.api-meta .badge.ok{color:var(--success);}
.api-meta .badge.err{color:var(--error);}
.api-meta .badge.pend{color:var(--warn);}
pre.api-code{background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px;font-size:0.7rem;line-height:1.6;overflow-x:auto;white-space:pre-wrap;word-break:break-all;max-height:190px;overflow-y:auto;color:#a8b4c8;font-family:'SF Mono','Fira Code',monospace;}
pre.api-code .key{color:#7c6fff;}
pre.api-code .str{color:#22d3ee;}
pre.api-code .num{color:#f59e0b;}
pre.api-code .bool{color:#22c55e;}
.copy-btn{font-size:0.66rem;padding:2px 8px;border-radius:5px;background:var(--surface);border:1px solid var(--border);color:var(--text2);cursor:pointer;float:right;margin-bottom:4px;}
.copy-btn:hover{color:var(--text);}
.main{padding:22px;display:flex;flex-direction:column;gap:22px;overflow-y:auto;}
.empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--text2);text-align:center;padding:60px 20px;}
.empty-icon{font-size:3.2rem;opacity:.22;}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;animation:fadeUp .35s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.result-img{width:100%;display:block;cursor:pointer;transition:transform .2s;}
.result-img:hover{transform:scale(1.003);}
.result-meta{padding:13px 15px;display:flex;flex-direction:column;gap:6px;}
.result-prompt-txt{font-size:0.78rem;color:var(--text2);line-height:1.5;}
.result-actions{display:flex;gap:7px;flex-wrap:wrap;}
.act-btn{padding:5px 13px;border-radius:7px;font-size:0.76rem;font-weight:600;cursor:pointer;border:none;transition:opacity .15s;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}
.act-btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;}
.act-btn.secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border);}
.act-btn:hover{opacity:.82;}
.hist-sec h2{font-size:0.72rem;font-weight:700;letter-spacing:.08em;color:var(--text2);text-transform:uppercase;margin-bottom:11px;}
.hist-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:9px;}
.hist-thumb{border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .2s,transform .15s;position:relative;aspect-ratio:1;background:var(--surface);}
.hist-thumb:hover{border-color:var(--accent);transform:scale(1.04);}
.hist-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.hist-ov{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center;font-size:1.2rem;}
.hist-thumb:hover .hist-ov{opacity:1;}
.lightbox{display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.9);align-items:center;justify-content:center;}
.lightbox.show{display:flex;}
.lightbox img{max-width:92vw;max-height:92vh;border-radius:10px;}
.lb-close{position:fixed;top:16px;right:20px;background:rgba(255,255,255,.12);border:none;color:#fff;width:36px;height:36px;border-radius:50%;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar">
  <!-- Logo + lang toggle -->
  <div class="logo-row">
    <div class="logo">
      <div class="logo-icon">&#127912;</div>
      <div><h1>KIO Gateway</h1><small>v4.3 &mdash; medo image</small></div>
    </div>
    <button class="lang-btn" id="langBtn" onclick="toggleLang()">ZH</button>
  </div>

  <!-- API Key -->
  <div>
    <div class="sec-label" id="lbl-apikey">&#128273; API Key</div>
    <div class="field">
      <div class="apikey-wrap">
        <input type="password" id="apikeyInput" placeholder="nb_... (optional, overrides default)" autocomplete="off">
        <button class="apikey-toggle" onclick="toggleKeyVis()" id="keyVisBtn">Show</button>
      </div>
      <div class="apikey-status default" id="apikeyStatus">Using built-in key</div>
    </div>
  </div>

  <!-- Prompt -->
  <div>
    <div class="sec-label" id="lbl-prompt">&#128221; Prompt</div>
    <div class="field">
      <label id="lbl-prompt-hint" style="font-size:.72rem">Description <span style="color:var(--text2);font-weight:400">(Ctrl+Enter to submit)</span></label>
      <textarea id="prompt" placeholder="A cute cat sitting by the window, soft sunlight, Ghibli style"></textarea>
    </div>
  </div>

  <!-- Model -->
  <div>
    <div class="sec-label" id="lbl-settings">&#9881;&#65039; Settings</div>
    <div class="field">
      <label id="lbl-model">Model</label>
      <select id="model">
        <option value="gemini-3.1-pro-preview" selected>gemini-3.1-pro-preview</option>
        <option value="medo-image">medo-image</option>
        <option value="dall-e-3">DALL-E 3</option>
      </select>
    </div>
  </div>

  <!-- Size -->
  <div>
    <div class="sec-label" id="lbl-size">&#128004; Size</div>
    <div class="size-grid" id="sizeGrid">
      <button class="size-btn active" data-size="1024x1024">1K<span class="ratio">1024&#215;1024</span></button>
      <button class="size-btn" data-size="1024x1792">1K P<span class="ratio">1024&#215;1792</span></button>
      <button class="size-btn" data-size="1792x1024">1K L<span class="ratio">1792&#215;1024</span></button>
      <button class="size-btn" data-size="2048x2048">2K<span class="ratio">2048&#215;2048</span></button>
      <button class="size-btn" data-size="2048x3584">2K P<span class="ratio">2048&#215;3584</span></button>
      <button class="size-btn" data-size="3584x2048">2K L<span class="ratio">3584&#215;2048</span></button>
      <button class="size-btn" data-size="4096x4096">4K<span class="ratio">4096&#215;4096</span></button>
      <button class="size-btn" data-size="4096x7168">4K P<span class="ratio">4096&#215;7168</span></button>
      <button class="size-btn" data-size="7168x4096">4K L<span class="ratio">7168&#215;4096</span></button>
    </div>
  </div>

  <!-- Progress -->
  <div class="prog-wrap" id="progWrap">
    <div class="prog-lbl" id="progLbl">Generating...</div>
    <div class="prog-bar"><div class="prog-fill" id="progFill"></div></div>
  </div>

  <!-- Generate -->
  <button class="gen-btn" id="genBtn">
    <span class="btn-txt" id="lbl-genbtn">&#10024; Generate Image</span>
    <div class="spin"></div>
  </button>
  <div class="status" id="statusMsg"></div>

  <!-- API Debug Panel -->
  <div class="api-panel" id="apiPanel">
    <div class="api-panel-header" id="apiToggle">
      <div class="api-panel-title"><div class="dot" id="apiDot"></div><span id="lbl-apipanel">API Info</span></div>
      <span class="api-chevron">&#9660;</span>
    </div>
    <div class="api-tabs" id="apiTabs" style="display:none">
      <div class="api-tab active" data-tab="req" id="tab-req">&#128228; Request</div>
      <div class="api-tab" data-tab="res" id="tab-res">&#128229; Response</div>
      <div class="api-tab" data-tab="poll" id="tab-poll">&#128260; Poll</div>
    </div>
    <div class="api-body" id="apiBody">
      <div id="tabReq">
        <div class="api-meta" id="reqMeta"></div>
        <button class="copy-btn" onclick="copyCode('reqCode')" id="lbl-copy">Copy</button>
        <pre class="api-code" id="reqCode">// No request sent yet</pre>
      </div>
      <div id="tabRes" style="display:none">
        <div class="api-meta" id="resMeta"></div>
        <button class="copy-btn" onclick="copyCode('resCode')">Copy</button>
        <pre class="api-code" id="resCode">// No response yet</pre>
      </div>
      <div id="tabPoll" style="display:none">
        <div class="api-meta" id="pollMeta"></div>
        <button class="copy-btn" onclick="copyCode('pollCode')">Copy</button>
        <pre class="api-code" id="pollCode">// No poll yet</pre>
      </div>
    </div>
  </div>
</aside>
<main class="main" id="main">
  <div class="empty-state" id="emptyState">
    <div class="empty-icon">&#128444;&#65039;</div>
    <h2 style="color:var(--text2);font-weight:500" id="lbl-empty-h">No images generated yet</h2>
    <p style="font-size:.78rem;max-width:240px;line-height:1.6" id="lbl-empty-p">Enter a prompt on the left, choose a size, and click Generate.</p>
  </div>
  <div id="latestResult" style="display:none"></div>
  <div class="hist-sec" id="histSec" style="display:none">
    <h2 id="lbl-history">&#128344; History</h2>
    <div class="hist-grid" id="histGrid"></div>
  </div>
</main>
</div>
<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose">&#10005;</button>
  <img id="lbImg" src="" alt="">
</div>
<script>
/* ---- i18n ---- */
var LANG=localStorage.getItem('kio_lang')||'en';
var T={
  en:{
    'lbl-apikey':'&#128273; API Key',
    'apikeyInput':'nb_... (optional, overrides default)',
    'apikey-custom':'&#10003; Using custom key',
    'apikey-default':'Using built-in key',
    'lbl-prompt':'&#128221; Prompt',
    'lbl-prompt-hint':'Description <span style="color:var(--text2);font-weight:400">(Ctrl+Enter to submit)</span>',
    'prompt-ph':'A cute cat sitting by the window, soft sunlight, Ghibli style',
    'lbl-settings':'&#9881;&#65039; Settings',
    'lbl-model':'Model',
    'lbl-size':'&#128004; Size',
    'lbl-genbtn':'&#10024; Generate Image',
    'progLbl':'Generating...',
    'lbl-apipanel':'API Info',
    'tab-req':'&#128228; Request',
    'tab-res':'&#128229; Response',
    'tab-poll':'&#128260; Poll',
    'lbl-copy':'Copy',
    'req-empty':'// No request sent yet',
    'res-empty':'// No response yet',
    'poll-empty':'// No poll yet',
    'lbl-empty-h':'No images generated yet',
    'lbl-empty-p':'Enter a prompt on the left, choose a size, and click Generate.',
    'lbl-history':'&#128344; History',
    'err-prompt':'Please enter a prompt',
    'err-no-img':'No image data in response',
    'err-no-url':'Cannot parse image URL',
    'ok-gen':'Image generated successfully!',
    'sending':'Sending request...',
    'polling-progress':'Polling for result...',
    'btn-download':'&#11015;&#65039; Download',
    'btn-copy-url':'&#128203; Copy URL',
    'btn-copied':'&#10003; Copied',
    'btn-fullscreen':'&#128269; Fullscreen',
    'poll-times':'polls',
    'size-p':'P','size-l':'L'
  },
  zh:{
    'lbl-apikey':'&#128273; API &#91325;',
    'apikeyInput':'nb_... (&#36984;&#22635;&#65292;&#35206;&#34986;&#38928;&#35373; key)',
    'apikey-custom':'&#10003; &#20351;&#29992;&#33258;&#35373; key',
    'apikey-default':'&#20351;&#29992;&#20967;&#35373; key',
    'lbl-prompt':'&#128221; &#25551;&#36848;',
    'lbl-prompt-hint':'&#25551;&#36848; <span style="color:var(--text2);font-weight:400">(Ctrl+Enter &#36011;&#20986;)</span>',
    'prompt-ph':'&#19968;&#38500;&#21487;&#24859;&#30340;&#23567;&#36931;&#22352;&#22312;&#31383;&#36794;&#65292;&#26580;&#21644;&#38525;&#20809;&#65292;&#21513;&#21368;&#21147;&#39080;&#26684;',
    'lbl-settings':'&#9881;&#65039; &#35373;&#23450;',
    'lbl-model':'&#27169;&#22411;',
    'lbl-size':'&#128004; &#23610;&#23544;',
    'lbl-genbtn':'&#10024; &#29983;&#25104;&#22294;&#20687;',
    'progLbl':'&#27491;&#22312;&#29983;&#25104;...',
    'lbl-apipanel':'API &#36039;&#35338;',
    'tab-req':'&#128228; &#35531;&#27714;',
    'tab-res':'&#128229; &#38997;&#24212;',
    'tab-poll':'&#128260; &#36736;&#35810;',
    'lbl-copy':'&#35531;&#21069;&#8203;&#35531;&#21069;',
    'req-empty':'// &#23544;&#26410;&#30332;&#36865;&#35531;&#27714;',
    'res-empty':'// &#23544;&#26410;&#25910;&#21040;&#38997;&#24212;',
    'poll-empty':'// &#23544;&#26410;&#36736;&#35810;',
    'lbl-empty-h':'&#23544;&#26410;&#29983;&#25104;&#20219;&#20309;&#22294;&#20687;',
    'lbl-empty-p':'&#22312;&#24038;&#20491;&#36664;&#20837;&#25551;&#36848;&#20006;&#36982;&#25321;&#23610;&#23544;&#65292;&#40670;&#64277;&#12300;&#29983;&#25104;&#22294;&#20687;&#12301;',
    'lbl-history':'&#128344; &#27511;&#21490;&#32000;&#37636;',
    'err-prompt':'&#35531;&#36664;&#20837;&#22294;&#20687;&#25551;&#36848;',
    'err-no-img':'&#38997;&#24212;&#20013;&#26410;&#25214;&#21040;&#22294;&#20687;&#25976;&#25578;',
    'err-no-url':'&#28961;&#27861;&#35299;&#26512;&#22294;&#20687; URL',
    'ok-gen':'&#22294;&#20687;&#29983;&#25104;&#25104;&#21151;&#65281;',
    'sending':'&#27491;&#22312;&#36011;&#20986;&#35531;&#27714;...',
    'polling-progress':'&#27491;&#22312;&#36736;&#35810;&#32080;&#26524;...',
    'btn-download':'&#11015;&#65039; &#19979;&#36617;',
    'btn-copy-url':'&#128203; &#35531;&#21069; URL',
    'btn-copied':'&#10003; &#24050;&#35531;&#21069;',
    'btn-fullscreen':'&#128269; &#20840;&#31435;&#24291;',
    'poll-times':'&#27425;&#36736;&#35810;',
    'size-p':'&#32244;','size-l':'&#6a6b;'
  }
};
function t(k){return T[LANG][k]||T['en'][k]||k;}
function applyLang(){
  var keys=['lbl-apikey','lbl-prompt','lbl-settings','lbl-model','lbl-size','lbl-genbtn',
    'lbl-apipanel','tab-req','tab-res','tab-poll','lbl-copy','lbl-empty-h','lbl-empty-p','lbl-history'];
  keys.forEach(function(k){
    var el=document.getElementById(k);
    if(el)el.innerHTML=t(k);
  });
  document.getElementById('lbl-prompt-hint').innerHTML=t('lbl-prompt-hint');
  document.getElementById('prompt').placeholder=t('prompt-ph');
  document.getElementById('apikeyInput').placeholder=t('apikeyInput');
  document.getElementById('progLbl').textContent=t('progLbl');
  document.getElementById('langBtn').textContent=LANG==='en'?'ZH':'EN';
  /* size P/L labels */
  document.querySelectorAll('.size-btn').forEach(function(b){
    var sz=b.dataset.size;
    var w=parseInt(sz),h=parseInt(sz.split('x')[1]);
    var base=sz.indexOf('x');
    var wv=parseInt(sz.substring(0,base)),hv=parseInt(sz.substring(base+1));
    if(wv===hv)return;
    var spans=b.querySelectorAll('span.ratio');
    var mainTxt=b.childNodes[0];
    /* rebuild label */
    var res=wv>2000?(wv>5000?'4K':'2K'):'1K';
    var orient=hv>wv?(' '+t('size-p')):(' '+t('size-l'));
    b.childNodes[0].textContent=res+orient;
  });
  updateKeyStatus();
}
function toggleLang(){
  LANG=LANG==='en'?'zh':'en';
  localStorage.setItem('kio_lang',LANG);
  applyLang();
}

/* ---- API Key ---- */
var customKey=localStorage.getItem('kio_apikey')||'';
function updateKeyStatus(){
  var input=document.getElementById('apikeyInput');
  var st=document.getElementById('apikeyStatus');
  if(customKey){
    input.value=customKey;
    st.className='apikey-status custom';
    st.innerHTML=t('apikey-custom');
  } else {
    input.value='';
    st.className='apikey-status default';
    st.textContent=t('apikey-default');
  }
}
function toggleKeyVis(){
  var inp=document.getElementById('apikeyInput');
  var btn=document.getElementById('keyVisBtn');
  if(inp.type==='password'){inp.type='text';btn.textContent='Hide';}
  else{inp.type='password';btn.textContent='Show';}
}
document.addEventListener('DOMContentLoaded',function(){
  var inp=document.getElementById('apikeyInput');
  inp.addEventListener('input',function(){
    customKey=inp.value.trim();
    if(customKey)localStorage.setItem('kio_apikey',customKey);
    else localStorage.removeItem('kio_apikey');
    updateKeyStatus();
  });
  applyLang();
  if(hist.length>0){
    var l=hist[0];
    document.getElementById('emptyState').style.display='none';
    document.getElementById('latestResult').style.display='block';
    document.getElementById('latestResult').appendChild(buildCard(l.src,l.prompt,null));
    renderHist();
  }
});

/* ---- State ---- */
var hist=JSON.parse(localStorage.getItem('kio_h')||'[]');
var progTimer=null,selectedSize='1024x1024';
function $(id){return document.getElementById(id);}
var genBtn=$('genBtn'),statusMsg=$('statusMsg');
var progWrap=$('progWrap'),progFill=$('progFill'),progLbl=$('progLbl');
var emptyState=$('emptyState'),latestResult=$('latestResult');
var histSec=$('histSec'),histGrid=$('histGrid');
var lightbox=$('lightbox'),lbImg=$('lbImg');
var apiPanel=$('apiPanel'),apiToggle=$('apiToggle'),apiDot=$('apiDot');
var apiTabs=$('apiTabs');

/* Size buttons */
document.querySelectorAll('.size-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.size-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    selectedSize=btn.dataset.size;
  });
});
/* API panel toggle */
var panelOpen=false;
apiToggle.addEventListener('click',function(){
  panelOpen=!panelOpen;
  apiPanel.classList.toggle('open',panelOpen);
  apiTabs.style.display=panelOpen?'flex':'none';
});
/* API tabs */
var activeTab='req';
document.querySelectorAll('.api-tab').forEach(function(tab){
  tab.addEventListener('click',function(){
    document.querySelectorAll('.api-tab').forEach(function(t){t.classList.remove('active');});
    tab.classList.add('active');
    activeTab=tab.dataset.tab;
    $('tabReq').style.display=activeTab==='req'?'block':'none';
    $('tabRes').style.display=activeTab==='res'?'block':'none';
    $('tabPoll').style.display=activeTab==='poll'?'block':'none';
  });
});
/* Syntax highlight */
function syntaxHL(obj){
  var s=JSON.stringify(obj,null,2);
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/("[^"]+")\s*:/g,'<span class="key">$1</span>:')
    .replace(/:\s*("[^"]*")/g,': <span class="str">$1</span>')
    .replace(/:\s*(-?\d+\.?\d*)/g,': <span class="num">$1</span>')
    .replace(/:\s*(true|false|null)/g,': <span class="bool">$1</span>');
}
function setApiReq(url,method,body){
  $('reqCode').innerHTML=syntaxHL({endpoint:url,method:method,body:body});
  $('reqMeta').innerHTML='<span><span class="badge pend">'+method+'</span></span><span>&#8987; -ms</span>';
  apiDot.className='dot pending';
}
function setApiRes(status,data,ms){
  $('resCode').innerHTML=syntaxHL(data);
  var ok=status>=200&&status<300;
  $('resMeta').innerHTML='<span><span class="badge '+(ok?'ok':'err')+'">'+status+'</span></span><span>&#8987; '+ms+'ms</span>';
  apiDot.className='dot '+(ok?'ok':'err');
}
function setApiPoll(attempts,taskId,finalStatus,data){
  $('pollCode').innerHTML=syntaxHL({task_id:taskId,attempts:attempts,final_status:finalStatus,result:data});
  var ok=finalStatus==='completed'||finalStatus==='success';
  $('pollMeta').innerHTML='<span>&#128260; '+attempts+' '+t('poll-times')+'</span><span><span class="badge '+(ok?'ok':'err')+'">'+finalStatus+'</span></span>';
}
function copyCode(id){navigator.clipboard.writeText($(id).textContent);}
function showStatus(type,msg){
  statusMsg.className='status '+type;
  statusMsg.textContent=(type==='error'?'\u274C ':'\u2705 ')+msg;
}
function startProg(lbl){
  progWrap.classList.add('show');progLbl.textContent=lbl||'...';
  var p=0;progFill.style.width='0%';
  progTimer=setInterval(function(){p=Math.min(p+(p<55?2.5:p<80?1:0.3),94);progFill.style.width=p+'%';},700);
}
function endProg(){
  clearInterval(progTimer);progFill.style.width='100%';
  setTimeout(function(){progWrap.classList.remove('show');},700);
}
function setLoad(on){
  genBtn.disabled=on;genBtn.classList.toggle('loading',on);
  if(on)startProg(t('sending'));else endProg();
}
function buildCard(src,prompt,revised){
  var card=document.createElement('div');card.className='result-card';
  var img=document.createElement('img');img.src=src;img.className='result-img';img.alt='';
  img.onclick=function(){openLb(src);};
  card.appendChild(img);
  var meta=document.createElement('div');meta.className='result-meta';
  var p=document.createElement('p');p.className='result-prompt-txt';
  p.textContent=(revised?'\uD83E\uDD16 '+revised:'\uD83D\uDCDD '+prompt);
  meta.appendChild(p);
  var acts=document.createElement('div');acts.className='result-actions';
  var dl=document.createElement('a');dl.className='act-btn primary';
  dl.href=src;dl.download='kio-'+Date.now()+'.png';dl.innerHTML=t('btn-download');
  acts.appendChild(dl);
  var cp=document.createElement('button');cp.className='act-btn secondary';
  cp.innerHTML=t('btn-copy-url');
  cp.onclick=function(){
    navigator.clipboard.writeText(src);
    cp.innerHTML=t('btn-copied');
    setTimeout(function(){cp.innerHTML=t('btn-copy-url');},2000);
  };
  acts.appendChild(cp);
  var lb=document.createElement('button');lb.className='act-btn secondary';
  lb.innerHTML=t('btn-fullscreen');lb.onclick=function(){openLb(src);};
  acts.appendChild(lb);
  meta.appendChild(acts);card.appendChild(meta);return card;
}
function saveHist(src,prompt){
  hist.unshift({src:src,prompt:prompt,ts:Date.now()});
  if(hist.length>20)hist=hist.slice(0,20);
  localStorage.setItem('kio_h',JSON.stringify(hist));renderHist();
}
function renderHist(){
  if(hist.length<=1)return;
  histSec.style.display='block';histGrid.innerHTML='';
  hist.slice(1).forEach(function(item){
    var th=document.createElement('div');th.className='hist-thumb';
    var i=document.createElement('img');i.src=item.src;
    var ov=document.createElement('div');ov.className='hist-ov';ov.textContent='\uD83D\uDD0D';
    th.appendChild(i);th.appendChild(ov);
    th.onclick=function(){openLb(item.src);};
    histGrid.appendChild(th);
  });
}
function openLb(src){lbImg.src=src;lightbox.classList.add('show');}
$('lbClose').onclick=function(){lightbox.classList.remove('show');};
lightbox.onclick=function(e){if(e.target===lightbox)lightbox.classList.remove('show');};
async function generate(){
  var prompt=$('prompt').value.trim();
  var model=$('model').value;
  var size=selectedSize;
  if(!prompt){showStatus('error',t('err-prompt'));return;}
  statusMsg.className='status';setLoad(true);
  if(!panelOpen){panelOpen=true;apiPanel.classList.add('open');apiTabs.style.display='flex';}
  var reqBody={prompt:prompt,model:model,size:size,n:1};
  var reqUrl=window.location.origin+'/v1/images/generations';
  var t0=Date.now();
  setApiReq(reqUrl,'POST',reqBody);
  var headers={'Content-Type':'application/json'};
  if(customKey)headers['X-User-Api-Key']=customKey;
  try{
    progLbl.textContent=t('sending');
    var res=await fetch('/v1/images/generations',{method:'POST',headers:headers,body:JSON.stringify(reqBody)});
    var t1=Date.now()-t0;
    var data=await res.json();
    setApiRes(res.status,data,t1);
    document.querySelectorAll('.api-tab').forEach(function(tb){tb.classList.remove('active');});
    $('tab-res').classList.add('active');
    activeTab='res';$('tabReq').style.display='none';$('tabRes').style.display='block';$('tabPoll').style.display='none';
    if(!res.ok)throw new Error((data&&data.error&&data.error.message)||'HTTP '+res.status);
    var item=data&&data.data&&data.data[0];
    if(item&&(item.task_id||item._poll_attempts)){
      setApiPoll(item._poll_attempts||'?',item.task_id||'-',item._poll_status||'completed',item);
    }
    if(!item)throw new Error(t('err-no-img'));
    var imgSrc=item.url||(item.b64_json?'data:image/png;base64,'+item.b64_json:null);
    if(!imgSrc){showStatus('error',t('err-no-url'));setLoad(false);return;}
    emptyState.style.display='none';latestResult.style.display='block';latestResult.innerHTML='';
    latestResult.appendChild(buildCard(imgSrc,prompt,item.revised_prompt||null));
    saveHist(imgSrc,prompt);showStatus('success',t('ok-gen'));
  }catch(err){
    apiDot.className='dot err';
    showStatus('error',err.message);
  }
  setLoad(false);
}
$('genBtn').onclick=generate;
$('prompt').addEventListener('keydown',function(e){
  if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();generate();}
});
<\/script>
</body></html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-api-key, X-User-Api-Key',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    const SUPABASE_URL = 'https://gjosebfngzowbcrwzxnw.supabase.co/functions/v1';
    const DEFAULT_KEY  = env.MEDO_API_KEY || 'nb_SBa89oD7xBbHSrwJKny3acDF6kRFuPBNgF2BEEDTdnRGMyBe';
    const SUPA_ANON    = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3NlYmZuZ3pvd2Jjcnd6eG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzA0MjcsImV4cCI6MjA4NzgwNjQyN30.OlsHb4DZmv22j9FZ1h8pj2tvFnKlS0hsxJJW1NMxR4E';

    // Custom key from UI takes priority
    const USER_KEY = request.headers.get('X-User-Api-Key');
    const API_KEY  = (USER_KEY && USER_KEY.trim()) ? USER_KEY.trim() : DEFAULT_KEY;

    const json = (d, s = 200) => new Response(JSON.stringify(d), {
      status: s, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
    const apiHdr = () => ({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + API_KEY,
      'apikey': SUPA_ANON,
    });
    const pollHdr = () => ({
      'Authorization': 'Bearer ' + API_KEY,
      'apikey': SUPA_ANON,
    });

    async function submitTask(body) {
      const r = await fetch(SUPABASE_URL + '/openai-compatible', {
        method: 'POST', headers: apiHdr(), body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error('openai-compatible ' + r.status + ': ' + await r.text());
      return r.json();
    }

    async function pollUntilDone(taskId, maxWait = 120000, interval = 3000) {
      const deadline = Date.now() + maxWait;
      let attempt = 0;
      while (Date.now() < deadline) {
        attempt++;
        await new Promise(r => setTimeout(r, interval));
        const r = await fetch(SUPABASE_URL + '/get-task-result?task_id=' + taskId, { headers: pollHdr() });
        if (!r.ok) continue;
        const d = await r.json();
        const st = d.status || d.state || d.task_status;
        console.log('[KIO] Poll #' + attempt + ' task=' + taskId + ' status=' + st);
        if (st === 'completed' || st === 'done' || st === 'success') return { data: d, attempts: attempt, status: st };
        if (st === 'failed' || st === 'error') throw new Error(d.error || d.message || 'Task failed');
      }
      throw new Error('Task ' + taskId + ' timeout after ' + (maxWait/1000) + 's');
    }

    function extractImg(r) {
      return r.image_url || r.url || r.output_url
        || (r.output && r.output.url) || (r.result && (r.result.url || r.result.image_url))
        || (Array.isArray(r.images) ? r.images[0] : null)
        || (Array.isArray(r.data) ? (r.data[0] && (r.data[0].url || r.data[0].image_url)) : null)
        || null;
    }
    function extractB64(r) { return r.b64_json || r.base64 || (r.result && r.result.b64_json) || null; }

    try {
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html'))
        return new Response(HTML_UI, { headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache' } });

      if (request.method === 'GET' && url.pathname === '/health')
        return json({ status: 'ok', version: '4.3.0', features: ['custom-api-key','i18n-en-zh','1K-2K-4K'], auth: 'api-key' });

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

        const usingCustomKey = !!(USER_KEY && USER_KEY.trim());
        const requestInfo = { prompt, model, n, size, quality, style,
          endpoint: SUPABASE_URL + '/openai-compatible',
          key_source: usingCustomKey ? 'custom (X-User-Api-Key)' : 'default' };
        const t0 = Date.now();

        const submitResp = await submitTask({ prompt, model, n, size, quality, style, response_format, ...extra });
        const submitMs = Date.now() - t0;
        console.log('[KIO] submit: ' + JSON.stringify(submitResp).slice(0, 400));

        const dImg = extractImg(submitResp);
        const dB64 = extractB64(submitResp);
        if (dImg || dB64) {
          return json({
            created: Math.floor(Date.now()/1000),
            _debug: { request: requestInfo, submit_ms: submitMs, mode: 'sync' },
            data: [{ ...(dImg?{url:dImg}:{}), ...(dB64?{b64_json:dB64}:{}), revised_prompt: submitResp.revised_prompt || prompt }],
          });
        }

        const taskId =
          (submitResp.data && submitResp.data[0] && submitResp.data[0].task_id) ||
          submitResp.task_id || submitResp.id ||
          submitResp.job_id  || submitResp.request_id;

        if (!taskId) {
          return json({
            created: Math.floor(Date.now()/1000),
            warning: 'Unknown upstream format - no task_id found',
            _debug: { request: requestInfo, submit_response: submitResp },
            data: [{ _raw: submitResp }],
          });
        }

        console.log('[KIO] task_id=' + taskId + ', polling...');
        const { data: pollData, attempts, status: pollStatus } = await pollUntilDone(taskId);
        const totalMs = Date.now() - t0;
        const imgUrl  = extractImg(pollData);
        const b64     = extractB64(pollData);

        return json({
          created: Math.floor(Date.now()/1000),
          _debug: {
            request: requestInfo, submit_ms: submitMs, total_ms: totalMs,
            mode: 'async', task_id: taskId,
            poll_attempts: attempts, poll_status: pollStatus, raw_poll: pollData,
          },
          data: [{
            ...(imgUrl ? { url: imgUrl } : {}),
            ...(b64    ? { b64_json: b64 } : {}),
            revised_prompt: pollData.revised_prompt || pollData.enhanced_prompt || prompt,
            task_id: taskId,
            _poll_attempts: attempts,
            _poll_status: pollStatus,
          }],
        });
      }

      return json({ error: { message: 'Not found: ' + request.method + ' ' + url.pathname }, ui: '/' }, 404);

    } catch (err) {
      console.error('[KIO] Error: ' + (err.stack || err.message));
      return json({ error: { message: err.message || 'Internal server error' }, _debug: { stack: err.stack } }, 500);
    }
  },
};
