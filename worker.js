/**
 * KIO Gateway v5.1 - Split Canvas UI + Image/Video Generation
 * Left sidebar + Right preview + Bottom history strip
 */

const HTML_UI = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>KIO Gateway</title>
<style>
:root{
  --bg:#0c0c10;--surface:#141418;--surface2:#1c1c23;--surface3:#22222d;
  --border:#2a2a38;--accent:#7c6fff;--accent2:#00d2ff;
  --text:#e2e2ef;--text2:#8c8ca3;--text3:#57576d;
  --success:#22c55e;--error:#ef4444;--warn:#f59e0b;
  --sidebar:280px;--radius:10px;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden}
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  background:var(--bg);color:var(--text);display:flex;flex-direction:column;
}
.topbar{
  height:46px;background:var(--surface);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 16px;gap:12px;flex-shrink:0;z-index:10;
}
.topbar-logo{display:flex;align-items:center;gap:8px}
.logo-icon{
  width:28px;height:28px;border-radius:7px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-size:13px;
}
.logo-title{
  font-size:.92rem;font-weight:700;
  background:linear-gradient(90deg,var(--accent),var(--accent2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.logo-ver{font-size:.6rem;color:var(--text3);margin-left:2px}
.topbar-spacer{flex:1}
.topbar-btn{
  background:var(--surface2);border:1px solid var(--border);border-radius:6px;
  color:var(--text2);font-size:.7rem;font-weight:700;padding:4px 10px;
  cursor:pointer;transition:all .15s;letter-spacing:.04em;
}
.topbar-btn:hover{border-color:var(--accent);color:var(--accent)}
.api-dot{width:7px;height:7px;border-radius:50%;background:var(--border);display:inline-block;margin-right:5px}
.api-dot.ok{background:var(--success)}
.api-dot.err{background:var(--error)}
.api-dot.pend{background:var(--warn);animation:blink 1s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.body-wrap{display:flex;flex:1;overflow:hidden}
.sidebar{
  width:var(--sidebar);background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0;
  scrollbar-width:thin;scrollbar-color:var(--border) transparent;
}
.sidebar::-webkit-scrollbar{width:4px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.acc-section{border-bottom:1px solid var(--border)}
.acc-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 14px;cursor:pointer;user-select:none;
  font-size:.7rem;font-weight:700;letter-spacing:.08em;color:var(--text2);text-transform:uppercase;
  transition:color .15s;
}
.acc-header:hover{color:var(--text)}
.acc-header .acc-icon{font-size:.85rem;margin-right:7px}
.acc-arrow{font-size:.6rem;transition:transform .2s;color:var(--text3)}
.acc-section.open .acc-arrow{transform:rotate(180deg)}
.acc-body{display:none;padding:10px 14px 14px}
.acc-section.open .acc-body{display:block}
.field{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.field:last-child{margin-bottom:0}
.field label{font-size:.72rem;color:var(--text2);font-weight:500}
input,select,textarea{
  background:var(--surface2);border:1px solid var(--border);border-radius:7px;
  color:var(--text);font-size:.82rem;padding:7px 10px;width:100%;outline:none;
  transition:border-color .2s;font-family:inherit;
}
input:focus,select:focus,textarea:focus{border-color:var(--accent)}
select option{background:var(--surface2)}
textarea#prompt{min-height:110px;resize:vertical;line-height:1.6}
.size-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.size-btn{
  background:var(--surface2);border:1px solid var(--border);border-radius:6px;
  color:var(--text2);font-size:.66rem;font-weight:600;padding:6px 2px;
  cursor:pointer;text-align:center;transition:all .15s;line-height:1.35;
}
.size-btn:hover{border-color:var(--accent);color:var(--text)}
.size-btn.active{border-color:var(--accent);background:rgba(124,111,255,.14);color:var(--accent)}
.size-btn .ratio{font-size:.58rem;color:var(--text3);display:block;margin-top:2px}
.size-btn.active .ratio{color:var(--accent);opacity:.65}
.mode-tab{transition:all .15s}
.mode-tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.apikey-wrap{position:relative}
.apikey-wrap input{padding-right:52px;font-family:'SF Mono','Fira Code',monospace;font-size:.75rem}
.apikey-eye{
  position:absolute;right:8px;top:50%;transform:translateY(-50%);
  background:none;border:none;color:var(--text2);cursor:pointer;font-size:.7rem;padding:2px 4px;
}
.apikey-eye:hover{color:var(--text)}
.key-status{font-size:.65rem;margin-top:3px}
.key-status.custom{color:var(--success)}
.key-status.default{color:var(--text3)}
.prog-wrap{margin-bottom:8px;display:none}
.prog-wrap.show{display:block}
.prog-lbl{font-size:.68rem;color:var(--text2);margin-bottom:4px}
.prog-bar{height:2px;background:var(--border);border-radius:99px;overflow:hidden}
.prog-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .4s ease}
.gen-btn{
  background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;
  border-radius:var(--radius);color:#fff;font-size:.88rem;font-weight:700;
  padding:11px;cursor:pointer;width:100%;transition:opacity .2s,transform .15s;
  display:flex;align-items:center;justify-content:center;gap:7px;
}
.gen-btn:hover{opacity:.88;transform:translateY(-1px)}
.gen-btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.gen-btn .spin{
  width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;
  border-radius:50%;animation:spin .7s linear infinite;display:none;
}
.gen-btn.loading .spin{display:block}
.gen-btn.loading .btn-txt{display:none}
@keyframes spin{to{transform:rotate(360deg)}}
.status{display:none;padding:7px 10px;border-radius:7px;font-size:.75rem;margin-top:6px}
.status.error{display:flex;gap:5px;background:rgba(239,68,68,.1);color:var(--error);border:1px solid rgba(239,68,68,.18)}
.status.success{display:flex;gap:5px;background:rgba(34,197,94,.08);color:var(--success);border:1px solid rgba(34,197,94,.18)}
.status.info{display:flex;gap:5px;background:rgba(245,158,11,.08);color:var(--warn);border:1px solid rgba(245,158,11,.18)}
.api-tabs{display:flex;border-bottom:1px solid var(--border);margin:-10px -14px 10px}
.api-tab{
  flex:1;padding:7px 4px;font-size:.66rem;font-weight:600;color:var(--text2);
  cursor:pointer;text-align:center;border-bottom:2px solid transparent;transition:all .15s;
}
.api-tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.api-meta{font-size:.65rem;color:var(--text2);margin-bottom:5px;display:flex;gap:8px;flex-wrap:wrap}
.badge{background:var(--surface);padding:1px 6px;border-radius:99px;font-size:.6rem;font-weight:700}
.badge.ok{color:var(--success)}
.badge.err{color:var(--error)}
.badge.pend{color:var(--warn)}
pre.api-code{
  background:var(--bg);border:1px solid var(--border);border-radius:6px;
  padding:8px;font-size:.67rem;line-height:1.6;overflow-x:auto;
  white-space:pre-wrap;word-break:break-all;max-height:180px;overflow-y:auto;
  color:#a0aec0;font-family:'SF Mono','Fira Code',monospace;
}
pre.api-code .key{color:#7c6fff}
pre.api-code .str{color:#22d3ee}
pre.api-code .num{color:#f59e0b}
pre.api-code .bool{color:#22c55e}
.copy-btn{
  font-size:.63rem;padding:2px 8px;border-radius:4px;
  background:var(--surface);border:1px solid var(--border);color:var(--text2);
  cursor:pointer;float:right;margin-bottom:4px;
}
.copy-btn:hover{color:var(--text)}
.canvas{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.canvas-preview{
  flex:1;display:flex;align-items:center;justify-content:center;
  overflow:hidden;position:relative;padding:24px;
}
.empty-state{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:14px;color:var(--text3);text-align:center;
}
.empty-icon{font-size:4rem;opacity:.15}
.empty-h{font-size:.95rem;font-weight:600;color:var(--text2)}
.empty-p{font-size:.75rem;max-width:240px;line-height:1.6}
.preview-wrap{
  display:none;width:100%;height:100%;position:relative;
  flex-direction:column;align-items:center;justify-content:center;
}
.preview-wrap.show{display:flex}
.preview-img,.preview-video{
  max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;
  box-shadow:0 8px 40px rgba(0,0,0,.6);animation:fadeIn .4s ease;
}
.preview-img{cursor:zoom-in}
.preview-video{display:none;background:#000}
@keyframes fadeIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
.preview-actions{
  position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
  display:flex;gap:8px;background:rgba(12,12,16,.85);
  border:1px solid var(--border);border-radius:99px;padding:6px 12px;
  backdrop-filter:blur(8px);flex-wrap:wrap;justify-content:center;
}
.preview-prompt{
  position:absolute;top:12px;left:12px;right:12px;background:rgba(12,12,16,.8);
  border:1px solid var(--border);border-radius:8px;padding:7px 11px;
  font-size:.72rem;color:var(--text2);line-height:1.5;backdrop-filter:blur(6px);
  max-height:76px;overflow:hidden;
}
.act-btn{
  padding:5px 12px;border-radius:99px;font-size:.72rem;font-weight:600;
  cursor:pointer;border:none;transition:all .15s;text-decoration:none;
  display:inline-flex;align-items:center;gap:4px;white-space:nowrap;
}
.act-btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff}
.act-btn.ghost{background:rgba(255,255,255,.08);color:var(--text);border:1px solid var(--border)}
.act-btn:hover{opacity:.82}
.hist-strip{
  height:96px;flex-shrink:0;border-top:1px solid var(--border);
  background:var(--surface);display:flex;align-items:center;padding:0 14px;gap:10px;overflow-x:auto;
  scrollbar-width:thin;scrollbar-color:var(--border) transparent;
}
.hist-strip::-webkit-scrollbar{height:3px}
.hist-strip::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.hist-empty{font-size:.7rem;color:var(--text3);white-space:nowrap;margin:auto}
.hist-thumb{
  width:70px;height:70px;flex-shrink:0;border-radius:7px;overflow:hidden;cursor:pointer;
  border:2px solid transparent;transition:border-color .15s,transform .15s;
  position:relative;background:var(--surface2);
  display:flex;align-items:center;justify-content:center;
}
.hist-thumb:hover{border-color:var(--accent);transform:scale(1.06)}
.hist-thumb.active{border-color:var(--accent2)}
.hist-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.hist-video{
  width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#1f2937,#111827);color:#cbd5e1;font-size:1.3rem;
}
.hist-tag{
  position:absolute;right:4px;bottom:4px;font-size:.55rem;font-weight:700;
  background:rgba(0,0,0,.65);padding:2px 5px;border-radius:99px;color:#fff;
}
.hist-ov{
  position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:0;transition:opacity .15s;
  display:flex;align-items:center;justify-content:center;font-size:.9rem;
}
.hist-thumb:hover .hist-ov{opacity:1}
.lightbox{
  display:none;position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.92);
  align-items:center;justify-content:center;
}
.lightbox.show{display:flex}
.lightbox img{max-width:94vw;max-height:94vh;border-radius:10px}
.lb-close{
  position:fixed;top:14px;right:18px;background:rgba(255,255,255,.1);border:none;color:#fff;
  width:34px;height:34px;border-radius:50%;font-size:.9rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
}
@media(max-width:720px){
  .sidebar{width:100%;height:auto;border-right:none;border-bottom:1px solid var(--border)}
  .body-wrap{flex-direction:column}
  .canvas-preview{min-height:320px;padding:14px}
  .hist-strip{height:80px}
  .hist-thumb{width:56px;height:56px}
}
</style>
</head>
<body>

<div class="topbar">
  <div class="topbar-logo">
    <div class="logo-icon">&#127912;</div>
    <span class="logo-title">KIO Gateway</span>
    <span class="logo-ver">v5.1</span>
  </div>
  <div class="topbar-spacer"></div>
  <span class="api-dot" id="apiDot"></span>
  <button class="topbar-btn" id="langBtn" onclick="toggleLang()">ZH</button>
</div>

<div class="body-wrap">
<aside class="sidebar" id="sidebar">

  <div class="acc-section open" id="sec-prompt">
    <div class="acc-header" onclick="toggleAcc('sec-prompt')">
      <span><span class="acc-icon">&#128221;</span><span id="lbl-prompt">PROMPT</span></span>
      <span class="acc-arrow">&#9660;</span>
    </div>
    <div class="acc-body">
      <div class="field">
        <label id="lbl-prompt-hint">Description <span style="color:var(--text3);font-weight:400;font-size:.65rem">(Ctrl+Enter)</span></label>
        <textarea id="prompt" placeholder="A futuristic city at dusk, neon lights, cinematic..."></textarea>
      </div>
      <div class="prog-wrap" id="progWrap">
        <div class="prog-lbl" id="progLbl">Generating...</div>
        <div class="prog-bar"><div class="prog-fill" id="progFill"></div></div>
      </div>
      <button class="gen-btn" id="genBtn">
        <span class="btn-txt" id="lbl-genbtn">&#10024; Generate</span>
        <div class="spin"></div>
      </button>
      <div class="status" id="statusMsg"></div>
    </div>
  </div>

  <div class="acc-section open" id="sec-mode">
    <div class="acc-header" style="padding:0;border-bottom:1px solid var(--border)">
      <div style="display:flex;width:100%;height:100%">
        <button class="mode-tab active" data-mode="image" onclick="switchMode('image')" style="flex:1;padding:11px;border:none;background:transparent;color:var(--text2);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s">📷 Image</button>
        <button class="mode-tab" data-mode="video" onclick="switchMode('video')" style="flex:1;padding:11px;border:none;background:transparent;color:var(--text2);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s">🎬 Video</button>
      </div>
    </div>
  </div>

  <div class="acc-section open" id="sec-settings">
    <div class="acc-header" onclick="toggleAcc('sec-settings')">
      <span><span class="acc-icon">&#9881;&#65039;</span><span id="lbl-settings">SETTINGS</span></span>
      <span class="acc-arrow">&#9660;</span>
    </div>
    <div class="acc-body">
      <div class="field">
        <label id="lbl-model">Model</label>
        <select id="model">
          <option value="gemini-3.1-pro-preview" selected>gemini-3.1-pro-preview</option>
          <option value="imagen-4">imagen-4</option>
          <option value="veo-3.1">veo-3.1</option>
          <option value="veo-3.1-preview">veo-3.1-preview</option>
        </select>
      </div>
      <div class="field">
        <label id="lbl-size">Size</label>
        <div class="size-grid" id="sizeGrid">
          <button class="size-btn active" data-size="1024x1024">1K&#13217;<span class="ratio">1024&#xD7;1024</span></button>
          <button class="size-btn" data-size="1024x1792">1K P<span class="ratio">1024&#xD7;1792</span></button>
          <button class="size-btn" data-size="1792x1024">1K L<span class="ratio">1792&#xD7;1024</span></button>
          <button class="size-btn" data-size="2048x2048">2K&#13217;<span class="ratio">2048&#xD7;2048</span></button>
          <button class="size-btn" data-size="2048x3584">2K P<span class="ratio">2048&#xD7;3584</span></button>
          <button class="size-btn" data-size="3584x2048">2K L<span class="ratio">3584&#xD7;2048</span></button>
          <button class="size-btn" data-size="4096x4096">4K&#13217;<span class="ratio">4096&#xD7;4096</span></button>
          <button class="size-btn" data-size="4096x7168">4K P<span class="ratio">4096&#xD7;7168</span></button>
          <button class="size-btn" data-size="7168x4096">4K L<span class="ratio">7168&#xD7;4096</span></button>
        </div>
      </div>
    </div>
  </div>

  <div class="acc-section" id="sec-apikey">
    <div class="acc-header" onclick="toggleAcc('sec-apikey')">
      <span><span class="acc-icon">&#128273;</span><span id="lbl-apikey">API KEY</span></span>
      <span class="acc-arrow">&#9660;</span>
    </div>
    <div class="acc-body">
      <div class="field">
        <label id="lbl-apikey-sub">Custom Key (optional)</label>
        <div class="apikey-wrap">
          <input type="password" id="apikeyInput" placeholder="nb_... overrides default" autocomplete="off">
          <button class="apikey-eye" id="keyVisBtn" onclick="toggleKeyVis()">&#128065;</button>
        </div>
        <div class="key-status default" id="apikeyStatus">Using built-in key</div>
      </div>
    </div>
  </div>

  <div class="acc-section" id="sec-debug">
    <div class="acc-header" onclick="toggleAcc('sec-debug')">
      <span><span class="acc-icon">&#128187;</span><span id="lbl-debug">API DEBUG</span></span>
      <span class="acc-arrow">&#9660;</span>
    </div>
    <div class="acc-body">
      <div class="api-tabs">
        <div class="api-tab active" data-tab="req" id="tab-req">&#128228; Req</div>
        <div class="api-tab" data-tab="res" id="tab-res">&#128229; Res</div>
        <div class="api-tab" data-tab="poll" id="tab-poll">&#128260; Poll</div>
      </div>
      <div id="tabReq">
        <div class="api-meta" id="reqMeta"></div>
        <button class="copy-btn" onclick="copyCode('reqCode')">Copy</button>
        <pre class="api-code" id="reqCode">// No request yet</pre>
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

<div class="canvas">
  <div class="canvas-preview" id="canvasPreview">
    <div class="empty-state" id="emptyState">
      <div class="empty-icon">&#128444;&#65039;</div>
      <div class="empty-h" id="lbl-empty-h">No media generated</div>
      <div class="empty-p" id="lbl-empty-p">Enter a prompt on the left and click Generate</div>
    </div>
    <div class="preview-wrap" id="previewWrap">
      <div class="preview-prompt" id="previewPrompt"></div>
      <img class="preview-img" id="previewImg" src="" alt="">
      <video class="preview-video" id="previewVid" src="" controls playsinline preload="metadata"></video>
      <div class="preview-actions" id="previewActions">
        <a class="act-btn primary" id="dlBtn" href="#" download="kio-output">&#11015;&#65039; Download</a>
        <button class="act-btn ghost" id="cpUrlBtn">&#128203; Copy URL</button>
        <button class="act-btn ghost" id="zoomBtn">&#128269; Zoom</button>
      </div>
    </div>
  </div>
  <div class="hist-strip" id="histStrip">
    <div class="hist-empty" id="histEmpty">&#8212; History will appear here &#8212;</div>
  </div>
</div>
</div>

<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose">&#10005;</button>
  <img id="lbImg" src="" alt="">
</div>

<script>
var LANG=localStorage.getItem('kio_lang')||'en';
var T={
  en:{
    'lbl-prompt':'PROMPT','lbl-settings':'SETTINGS','lbl-apikey':'API KEY','lbl-debug':'API DEBUG',
    'lbl-genbtn':'&#10024; Generate','lbl-model':'Model','lbl-size':'Size','lbl-mode-image':'📷 Image','lbl-mode-video':'🎬 Video',
    'lbl-apikey-sub':'Custom Key (optional)',
    'lbl-prompt-hint':'Description <span style="color:var(--text3);font-weight:400;font-size:.65rem">(Ctrl+Enter)</span>',
    'prompt-ph':'A futuristic city at dusk, neon lights, cinematic...',
    'apikey-ph':'nb_... overrides default','apikey-custom':'&#10003; Using custom key',
    'apikey-default':'Using built-in key',
    'lbl-empty-h':'No media generated',
    'lbl-empty-p':'Enter a prompt on the left and click Generate',
    'lbl-history-empty':'&#8212; History will appear here &#8212;',
    'progLbl':'Generating...','sending':'Sending request...','sending-video':'Submitting video task...',
    'err-prompt':'Please enter a prompt','err-no-media':'No media data in response',
    'err-no-url':'Cannot parse media URL',
    'ok-gen-image':'Image generated!','ok-gen-video':'Video generated!',
    'info-b64-skip':'Preview shown (base64 not saved to history)',
    'info-b64-mem':'Preview shown; upload timeout, saved as temporary base64 history',
    'btn-dl':'&#11015;&#65039; Download','btn-copy-url':'&#128203; Copy URL',
    'btn-copied':'&#10003; Copied','btn-zoom':'&#128269; Zoom',
    'poll-times':'polls','tab-req':'&#128228; Req','tab-res':'&#128229; Res','tab-poll':'&#128260; Poll',
    'hist-video':'VIDEO'
    },
  zh:{
    'lbl-prompt':'\u63d0\u793a\u8a5e','lbl-settings':'\u8a2d\u5b9a','lbl-apikey':'API \u91d1\u9470',
    'lbl-debug':'API \u9664\u932f','lbl-genbtn':'&#10024; \u751f\u6210',
    'lbl-model':'\u6a21\u578b','lbl-size':'\u5c3a\u5bf8','lbl-mode-image':'📷 \u5716\u50cf','lbl-mode-video':'🎬 \u5f71\u7247',
    'lbl-apikey-sub':'\u81ea\u8a02 Key\uff08\u9078\u586b\uff09',
    'lbl-prompt-hint':'\u63d0\u793a\u8a5e <span style="color:var(--text3);font-weight:400;font-size:.65rem">(Ctrl+Enter)</span>',
    'prompt-ph':'\u672a\u4f86\u57ce\u5e02\u7684\u9ec3\u660f\uff0c\u9713\u8679\u71c8\uff0c\u96fb\u5f71\u98a8\u683c...',
    'apikey-ph':'nb_... \u8986\u84cb\u9810\u8a2d',
    'apikey-custom':'&#10003; \u4f7f\u7528\u81ea\u8a02 key',
    'apikey-default':'\u4f7f\u7528\u9810\u8a2d key',
    'lbl-empty-h':'\u5c1a\u672a\u751f\u6210\u5167\u5bb9',
    'lbl-empty-p':'\u5728\u5de6\u5074\u8f38\u5165\u63d0\u793a\u8a5e\u5f8c\u9ede\u64ca\u751f\u6210',
    'lbl-history-empty':'&#8212; \u6b77\u53f2\u7d00\u9304\u5c07\u986f\u793a\u65bc\u6b64 &#8212;',
    'progLbl':'\u6b63\u5728\u751f\u6210...','sending':'\u6b63\u5728\u767c\u9001\u8acb\u6c42...',
    'sending-video':'\u6b63\u5728\u63d0\u4ea4\u5f71\u7247\u4efb\u52d9...',
    'err-prompt':'\u8acb\u8f38\u5165\u63d0\u793a\u8a5e',
    'err-no-media':'\u56de\u61c9\u4e2d\u7121\u5a92\u9ad4\u8cc7\u6599',
    'err-no-url':'\u7121\u6cd5\u89e3\u6790\u5a92\u9ad4 URL',
    'ok-gen-image':'\u5716\u50cf\u751f\u6210\u6210\u529f\uff01',
    'ok-gen-video':'\u5f71\u7247\u751f\u6210\u6210\u529f\uff01',
    'info-b64-skip':'\u5df2\u986f\u793a\u9810\u89bd\uff0cbase64 \u4e0d\u5beb\u5165\u6b77\u53f2',
    'info-b64-mem':'\u5df2\u986f\u793a\u9810\u89bd\uff1b\u4e0a\u50b3\u903e\u6642\uff0c\u5df2\u66ab\u5b58 base64 \u81f3\u8a18\u61b6\u9ad4\u6b77\u53f2',
    'btn-dl':'&#11015;&#65039; \u4e0b\u8f09',
    'btn-copy-url':'&#128203; \u8907\u88fd URL',
    'btn-copied':'&#10003; \u5df2\u8907\u88fd',
    'btn-zoom':'&#128269; \u653e\u5927',
    'poll-times':'\u6b21\u8f2a\u8a62',
    'tab-req':'&#128228; \u8acb\u6c42','tab-res':'&#128229; \u56de\u61c9','tab-poll':'&#128260; \u8f2a\u8a62',
    'hist-video':'\u5f71\u7247'
  }
};
function tr(k){return T[LANG][k]||T.en[k]||k;}
function applyLang(){
  ['lbl-prompt','lbl-settings','lbl-apikey','lbl-debug','lbl-genbtn','lbl-model','lbl-size',
   'lbl-apikey-sub','lbl-empty-h','lbl-empty-p','tab-req','tab-res','tab-poll']
  .forEach(function(id){var el=document.getElementById(id);if(el)el.innerHTML=tr(id);});
  document.getElementById('lbl-prompt-hint').innerHTML=tr('lbl-prompt-hint');
  document.getElementById('prompt').placeholder=tr('prompt-ph');
  document.getElementById('apikeyInput').placeholder=tr('apikey-ph');
  document.getElementById('langBtn').textContent=LANG==='en'?'ZH':'EN';
  document.getElementById('dlBtn').innerHTML=tr('btn-dl');
  document.getElementById('cpUrlBtn').innerHTML=tr('btn-copy-url');
  document.getElementById('zoomBtn').innerHTML=tr('btn-zoom');
  updateKeyStatus();
  renderHist();
}
function toggleLang(){LANG=LANG==='en'?'zh':'en';localStorage.setItem('kio_lang',LANG);applyLang();}
function toggleAcc(id){document.getElementById(id).classList.toggle('open');}

var customKey=localStorage.getItem('kio_apikey')||'';
function updateKeyStatus(){
  var inp=document.getElementById('apikeyInput');
  var st=document.getElementById('apikeyStatus');
  if(customKey){inp.value=customKey;st.className='key-status custom';st.innerHTML=tr('apikey-custom');}
  else{inp.value='';st.className='key-status default';st.innerHTML=tr('apikey-default');}
}
function toggleKeyVis(){
  var inp=document.getElementById('apikeyInput');
  inp.type=inp.type==='password'?'text':'password';
}

function safeParseHist(){
  try{var raw=localStorage.getItem('kio_h');if(!raw)return[];var a=JSON.parse(raw);return Array.isArray(a)?a:[];}
  catch(e){localStorage.removeItem('kio_h');return[];}
}
var hist=safeParseHist();
var activeHistIdx=0;

function isVideoModel(m){return/(^|-)veo/i.test(String(m||''))||String(m||'').includes('veo');}
function inferKind(src){
  var s=String(src||'').toLowerCase();
  if(s.startsWith('data:video/'))return'video';
  if(s.startsWith('data:image/'))return'image';
  if(s.includes('.mp4')||s.includes('.webm')||s.includes('.mov')||s.includes('video'))return'video';
  return'image';
}

function saveHist(src,prompt,kind){
  if(!src)return;
  hist.unshift({src:src,prompt:prompt,kind:kind||inferKind(src),ts:Date.now()});
  if(hist.length>10)hist=hist.slice(0,10);
  try{localStorage.setItem('kio_h',JSON.stringify(hist));}
  catch(e){
    while(hist.length>1){hist.pop();try{localStorage.setItem('kio_h',JSON.stringify(hist));break;}catch(e2){}}
  }
  activeHistIdx=0;renderHist();
}

function renderHist(){
  var strip=document.getElementById('histStrip');
  if(!strip)return;
  if(hist.length===0){strip.innerHTML='<div class="hist-empty">'+tr('lbl-history-empty')+'</div>';return;}
  strip.innerHTML='';
  hist.forEach(function(item,i){
    var th=document.createElement('div');
    th.className='hist-thumb'+(i===activeHistIdx?' active':'');
    var kind=item.kind||inferKind(item.src);
    if(kind==='video'){
      var box=document.createElement('div');box.className='hist-video';box.textContent='\uD83C\uDFAC';
      var tag=document.createElement('div');tag.className='hist-tag';tag.textContent=tr('hist-video');
      th.appendChild(box);th.appendChild(tag);
    }else{
      var img=document.createElement('img');img.src=item.src;img.alt='';th.appendChild(img);
    }
    var ov=document.createElement('div');ov.className='hist-ov';ov.textContent='\uD83D\uDD0D';
    th.appendChild(ov);
    th.onclick=function(){activeHistIdx=i;showPreview(item.src,item.prompt,item.kind);renderHist();};
    strip.appendChild(th);
  });
}

function openLb(src){document.getElementById('lbImg').src=src;document.getElementById('lightbox').classList.add('show');}
document.getElementById('lbClose').onclick=function(){document.getElementById('lightbox').classList.remove('show');};
document.getElementById('lightbox').onclick=function(e){if(e.target===this)this.classList.remove('show');};

function showPreview(src,prompt,kind){
  var mediaKind=kind||inferKind(src);
  document.getElementById('emptyState').style.display='none';
  document.getElementById('previewWrap').classList.add('show');
  var img=document.getElementById('previewImg');
  var vid=document.getElementById('previewVid');
  var zoomBtn=document.getElementById('zoomBtn');
  var dl=document.getElementById('dlBtn');
  var cpBtn=document.getElementById('cpUrlBtn');
  document.getElementById('previewPrompt').textContent=(mediaKind==='video'?'\uD83C\uDFAC ':'\uD83D\uDCCB ')+prompt;
  if(mediaKind==='video'){
    img.style.display='none';img.src='';
    vid.style.display='block';vid.src=src;
    zoomBtn.style.display='none';
    dl.download='kio-'+Date.now()+'.mp4';
  }else{
    vid.pause();vid.style.display='none';vid.removeAttribute('src');vid.load();
    img.style.display='block';img.src=src;
    img.onclick=function(){openLb(src);};
    zoomBtn.style.display='inline-flex';
    dl.download='kio-'+Date.now()+'.png';
  }
  dl.href=src;
  cpBtn.innerHTML=tr('btn-copy-url');
  cpBtn.onclick=function(){
    navigator.clipboard.writeText(src);
    cpBtn.innerHTML=tr('btn-copied');
    setTimeout(function(){cpBtn.innerHTML=tr('btn-copy-url');},2000);
  };
  zoomBtn.onclick=function(){if(mediaKind!=='video')openLb(src);};
}

var activeTab='req';
document.querySelectorAll('.api-tab').forEach(function(tab){
  tab.addEventListener('click',function(){
    document.querySelectorAll('.api-tab').forEach(function(t){t.classList.remove('active');});
    tab.classList.add('active');activeTab=tab.dataset.tab;
    document.getElementById('tabReq').style.display=activeTab==='req'?'block':'none';
    document.getElementById('tabRes').style.display=activeTab==='res'?'block':'none';
    document.getElementById('tabPoll').style.display=activeTab==='poll'?'block':'none';
  });
});
function syntaxHL(obj){
  var s=JSON.stringify(obj,null,2);
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(\\"[^\\"]+\\")\\s*:/g,'<span class="key">$1</span>:')
    .replace(/:\\s*(\\"[^\\"]*\\")/g,': <span class="str">$1</span>')
    .replace(/:\\s*(-?\\d+\\.?\\d*)/g,': <span class="num">$1</span>')
    .replace(/:\\s*(true|false|null)/g,': <span class="bool">$1</span>');
}
function setApiReq(url,method,body){
  document.getElementById('reqCode').innerHTML=syntaxHL({endpoint:url,method:method,body:body});
  document.getElementById('reqMeta').innerHTML='<span><span class="badge pend">'+method+'</span></span><span>&#8987; pending</span>';
  document.getElementById('apiDot').className='api-dot pend';
}
function setApiRes(status,data,ms){
  document.getElementById('resCode').innerHTML=syntaxHL(data);
  var ok=status>=200&&status<300;
  document.getElementById('resMeta').innerHTML='<span><span class="badge '+(ok?'ok':'err')+'">'+status+'</span></span><span>&#8987; '+ms+'ms</span>';
  document.getElementById('apiDot').className='api-dot '+(ok?'ok':'err');
}
function setApiPoll(attempts,taskId,finalStatus,data){
  document.getElementById('pollCode').innerHTML=syntaxHL({task_id:taskId,attempts:attempts,final_status:finalStatus,result:data});
  var ok=finalStatus==='completed'||finalStatus==='success'||finalStatus==='done';
  document.getElementById('pollMeta').innerHTML='<span>'+attempts+' '+tr('poll-times')+'</span><span><span class="badge '+(ok?'ok':'err')+'">'+finalStatus+'</span></span>';
}
function copyCode(id){navigator.clipboard.writeText(document.getElementById(id).textContent);}

var progTimer=null;
function startProg(lbl){
  document.getElementById('progWrap').classList.add('show');
  document.getElementById('progLbl').textContent=lbl||'...';
  var p=0;document.getElementById('progFill').style.width='0%';
  progTimer=setInterval(function(){p=Math.min(p+(p<55?2.5:p<80?1:0.3),94);document.getElementById('progFill').style.width=p+'%';},700);
}
function endProg(){
  clearInterval(progTimer);document.getElementById('progFill').style.width='100%';
  setTimeout(function(){document.getElementById('progWrap').classList.remove('show');},700);
}
function showStatus(type,msg){
  var el=document.getElementById('statusMsg');
  el.className='status '+type;
  el.textContent=(type==='error'?'\u274C ':type==='info'?'\u2139\uFE0F ':'\u2705 ')+msg;
}

var selectedSize='1024x1024';
var currentMode='image';
function switchMode(mode){
  currentMode=mode;
  document.querySelectorAll('.mode-tab').forEach(function(t){t.classList.remove('active');});
  document.querySelector('.mode-tab[data-mode="'+mode+'"]').classList.add('active');
  var modelSel=document.getElementById('model');
  if(mode==='image'){
    modelSel.value='gemini-3.1-pro-preview';
    document.querySelectorAll('.size-btn').forEach(function(b){b.style.display='block'});
  }else{
    modelSel.value='veo-3.1';
    document.querySelectorAll('.size-btn').forEach(function(b){b.style.display='block'});
  }
  modelSel.dispatchEvent(new Event('change'));
}
document.querySelectorAll('.size-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.size-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');selectedSize=btn.dataset.size;
  });
});

document.getElementById('model').addEventListener('change',function(){
  var isV=isVideoModel(this.value);
  document.getElementById('lbl-size').textContent=
    LANG==='zh'?(isV?'\u6bd4\u4f8b / \u5c3a\u5bf8':'\u5c3a\u5bf8'):(isV?'Aspect / Size':'Size');
});

var genBtn=document.getElementById('genBtn');
function setLoad(on,lbl){
  genBtn.disabled=on;genBtn.classList.toggle('loading',on);
  if(on)startProg(lbl||tr('sending'));else endProg();
}

async function generate(){
  var prompt=document.getElementById('prompt').value.trim();
  var model=document.getElementById('model').value;
  var videoMode=isVideoModel(model);
  if(!prompt){showStatus('error',tr('err-prompt'));return;}
  document.getElementById('statusMsg').className='status';
  setLoad(true,videoMode?tr('sending-video'):tr('sending'));
  var dbgSec=document.getElementById('sec-debug');
  if(!dbgSec.classList.contains('open'))dbgSec.classList.add('open');
  var reqPath=videoMode?'/v1/videos/generations':'/v1/images/generations';
  var reqBody={prompt:prompt,model:model,size:selectedSize,n:1,response_format:'url'};
  setApiReq(window.location.origin+reqPath,'POST',reqBody);
  var headers={'Content-Type':'application/json'};
  if(customKey)headers['X-User-Api-Key']=customKey;
  var t0=Date.now();
  try{
    var res=await fetch(reqPath,{method:'POST',headers:headers,body:JSON.stringify(reqBody)});
    var ms=Date.now()-t0;
    var data=await res.json();
    setApiRes(res.status,data,ms);
    document.querySelectorAll('.api-tab').forEach(function(t){t.classList.remove('active');});
    document.getElementById('tab-res').classList.add('active');
    activeTab='res';
    document.getElementById('tabReq').style.display='none';
    document.getElementById('tabRes').style.display='block';
    document.getElementById('tabPoll').style.display='none';
    if(!res.ok)throw new Error((data&&data.error&&data.error.message)||'HTTP '+res.status);
    var item=data&&data.data&&data.data[0];
    if(item&&(item.task_id||item._poll_attempts)){
      setApiPoll(item._poll_attempts||'?',item.task_id||'-',item._poll_status||'completed',item);
    }
    if(!item)throw new Error(tr('err-no-media'));
    var videoSrc=item.video_url||null;
    var imageSrc=item.url||(item.b64_json?'data:image/png;base64,'+item.b64_json:null);
    var mediaSrc=videoSrc||imageSrc;
    var mediaKind=videoSrc?'video':(imageSrc?inferKind(imageSrc):(videoMode?'video':'image'));
    if(!mediaSrc){showStatus('error',tr('err-no-url'));setLoad(false);return;}
    showPreview(mediaSrc,prompt,mediaKind);
    saveHist(mediaSrc,prompt,mediaKind);
    if(mediaKind==='video')showStatus('success',tr('ok-gen-video'));
    else showStatus('success',tr('ok-gen-image'));
  }catch(err){
    document.getElementById('apiDot').className='api-dot err';
    showStatus('error',err.message||String(err));
  }
  setLoad(false);
}
genBtn.onclick=generate;
document.getElementById('prompt').addEventListener('keydown',function(e){
  if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();generate();}
});

document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('apikeyInput').addEventListener('input',function(){
    customKey=this.value.trim();
    if(customKey)localStorage.setItem('kio_apikey',customKey);
    else localStorage.removeItem('kio_apikey');
    updateKeyStatus();
  });
  applyLang();
  renderHist();
  if(hist.length>0)showPreview(hist[0].src,hist[0].prompt,hist[0].kind);
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
    const isVideoModel = (m) => /(^|-)veo/i.test(String(m || '')) || String(m || '').includes('veo');

    async function submitTask(body) {
      const r = await fetch(SUPABASE_URL + '/openai-compatible', {
        method: 'POST', headers: apiHdr(), body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error('openai-compatible ' + r.status + ': ' + await r.text());
      return r.json();
    }

    async function pollUntilDone(taskId, maxWait = 300000, interval = 5000) {
      const deadline = Date.now() + maxWait;
      let attempt = 0;
      while (Date.now() < deadline) {
        attempt++;
        await new Promise(r => setTimeout(r, interval));
        const r = await fetch(SUPABASE_URL + '/get-task-result?task_id=' + encodeURIComponent(taskId), { headers: pollHdr() });
        if (!r.ok) continue;
        const d = await r.json();
        const st = d.status || d.state || d.task_status;
        if (st === 'completed' || st === 'done' || st === 'success') return { data: d, attempts: attempt, status: st };
        if (st === 'failed' || st === 'error') throw new Error(d.error || d.message || 'Task failed');
      }
      throw new Error('Task ' + taskId + ' timeout after ' + (maxWait / 1000) + 's');
    }

    function first(v) { return Array.isArray(v) ? v[0] : v; }

    function extractVideo(r) {
      return r.video_url || r.video || r.output_video || r.videoUrl
        || (r.output && (r.output.video_url || r.output.video || first(r.output.videos)))
        || (r.result && (r.result.video_url || r.result.video))
        || (Array.isArray(r.videos) ? r.videos[0] : null)
        || (Array.isArray(r.data) ? (r.data[0] && (r.data[0].video_url || r.data[0].video)) : null)
        || null;
    }

    function extractImg(r) {
      return r.image_url || r.url || r.output_url || r.image
        || (r.output && (r.output.url || r.output.image_url || first(r.output.images)))
        || (r.result && (r.result.url || r.result.image_url))
        || (Array.isArray(r.images) ? r.images[0] : null)
        || (Array.isArray(r.data) ? (r.data[0] && (r.data[0].url || r.data[0].image_url)) : null)
        || null;
    }

    function extractB64(r) { return r.b64_json || r.base64 || (r.result && r.result.b64_json) || null; }


    try {
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html'))
        return new Response(HTML_UI, { headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache' } });

      if (request.method === 'GET' && url.pathname === '/health')
        return json({ status: 'ok', version: '5.1.0', ui: 'split-canvas', features: ['image','video','i18n','custom-key','history-guard'] });

      if (request.method === 'GET' && url.pathname === '/v1/models')
        return json({ object: 'list', data: [
          { id: 'gemini-3.1-pro-preview', object: 'model', owned_by: 'google' },
          { id: 'imagen-4',               object: 'model', owned_by: 'google' },
          { id: 'veo-3.1',               object: 'model', owned_by: 'google' },
          { id: 'veo-3.1-preview',       object: 'model', owned_by: 'google' },
        ]});


      if (
        request.method === 'POST' && (
          url.pathname === '/v1/images/generations' ||
          url.pathname === '/v1/images/generate' ||
          url.pathname === '/v1/videos/generations' ||
          url.pathname === '/v1/videos/generate'
        )
      ) {
        const body = await request.json();
        const { prompt, model = 'gemini-3.1-pro-preview', n = 1, size = '1024x1024',
                quality = 'standard', style = 'vivid', response_format = 'url', ...extra } = body;

        if (!prompt) return json({ error: { message: 'prompt is required' } }, 400);

        const videoMode = isVideoModel(model) || url.pathname.includes('/videos/');
        const usingCustomKey = !!(USER_KEY && USER_KEY.trim());
        const requestInfo = { prompt, model, n, size,
          media_type: videoMode ? 'video' : 'image',
          endpoint: SUPABASE_URL + '/openai-compatible',
          key_source: usingCustomKey ? 'custom' : 'default' };
        const t0 = Date.now();

        const submitResp = await submitTask({ prompt, model, n, size, quality, style, response_format, ...extra });
        const submitMs = Date.now() - t0;

        let syncVideo = extractVideo(submitResp);
        let syncImg   = extractImg(submitResp);
        const syncB64 = extractB64(submitResp);
        if (syncVideo || syncImg || syncB64) {
          return json({
            created: Math.floor(Date.now() / 1000),
            _debug: { request: requestInfo, submit_ms: submitMs, mode: 'sync' },
            data: [{
              ...(syncVideo ? { video_url: syncVideo } : {}),
              ...(syncImg   ? { url: syncImg }         : {}),
              ...(syncB64   ? { b64_json: syncB64 }    : {}),
              revised_prompt: submitResp.revised_prompt || prompt,
            }],
          });
        }

        const taskId =
          (submitResp.data && submitResp.data[0] && submitResp.data[0].task_id) ||
          submitResp.task_id || submitResp.id || submitResp.job_id || submitResp.request_id;

        if (!taskId) {
          return json({
            created: Math.floor(Date.now() / 1000),
            warning: 'No task_id found in upstream response',
            _debug: { request: requestInfo, submit_response: submitResp },
            data: [{ _raw: submitResp }],
          });
        }

        const { data: pollData, attempts, status: pollStatus } = await pollUntilDone(taskId);
        const totalMs = Date.now() - t0;
        let videoUrl = extractVideo(pollData);
        let imgUrl   = extractImg(pollData);
        const b64    = extractB64(pollData);

        return json({
          created: Math.floor(Date.now() / 1000),
          _debug: { request: requestInfo, submit_ms: submitMs, total_ms: totalMs,
            mode: 'async', task_id: taskId, poll_attempts: attempts, poll_status: pollStatus },
          data: [{
            ...(videoUrl ? { video_url: videoUrl } : {}),
            ...(imgUrl   ? { url: imgUrl }          : {}),
            ...(b64      ? { b64_json: b64 }        : {}),
            revised_prompt: pollData.revised_prompt || pollData.enhanced_prompt || prompt,
            task_id: taskId, _poll_attempts: attempts, _poll_status: pollStatus,
          }],
        });
      }

      return json({ error: { message: 'Not found: ' + request.method + ' ' + url.pathname }, ui: '/' }, 404);

    } catch (err) {
      console.error('[KIO] ' + (err.stack || err.message));
      return json({ error: { message: err.message || 'Internal server error' } }, 500);
    }
  },
};
