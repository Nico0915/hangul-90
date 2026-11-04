/* =========================================================
   app.js — 한글 90 逻辑
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const KEY = 'hangul90.v1';

/* ---------- utils ---------- */
const pad = n => String(n).padStart(2, '0');
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const parseD = s => { const [a, b, c] = s.split('-').map(Number); return new Date(a, b - 1, c); };
const dayDiff = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

/* ---------- state ---------- */
const DEF = {
  streak: 0, last: null, minutes: {}, doneWeeks: [], currentWeek: 1,
  srs: {}, quiz: { right: 0, total: 0 },
  settings: { rate: 0.92, blind: false, gap: 2600, loop: false, scene: 'week' },
  starts: null
};

let S = (() => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEF));
    return Object.assign(JSON.parse(JSON.stringify(DEF)), JSON.parse(raw));
  } catch (e) { return JSON.parse(JSON.stringify(DEF)); }
})();

function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

function logStudy(min) {
  const t = todayStr();
  S.minutes[t] = (S.minutes[t] || 0) + min;
  if (S.last !== t) {
    if (S.last && dayDiff(S.last, t) === 1) S.streak += 1;
    else if (!S.last) S.streak = 1;
    else if (dayDiff(S.last, t) > 1) S.streak = 1;
    S.last = t;
  }
  if (!S.starts) S.starts = t;
  save();
  paintStreak();
}

function paintStreak() {
  const n = $('#streakNum');
  if (n) n.textContent = S.streak;
  const chip = $('#streakChip');
  if (chip) chip.classList.toggle('is-hot', S.streak >= 3);
}

const weekMeta = w => WEEK_META.find(x => x.w === w) || WEEK_META[0];
const curWeek = () => Math.min(12, Math.max(1, S.currentWeek));
const isStandalone = () => (window.navigator && window.navigator.standalone === true) ||
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

function weekLines(w) { return LINES.filter(l => l.wk === w); }
function sceneOf(id) { return TRAVEL.find(t => t.id === id); }
function playerLines() {
  if (S.settings.scene && S.settings.scene !== 'week') {
    const sc = sceneOf(S.settings.scene);
    if (sc) return sc.lines;
  }
  return weekLines(curWeek());
}
function playerLabel() {
  if (S.settings.scene && S.settings.scene !== 'week') {
    const sc = sceneOf(S.settings.scene);
    return sc ? sc.name : '第 ' + curWeek() + ' 周';
  }
  return '第 ' + curWeek() + ' 周';
}
function weekGrammar(w) { return GRAMMAR.filter(g => g.wk === w); }
function weekVocab(w) { return (VOCAB.find(v => v.wk === w) || { words: [] }).words; }
function allWordsUpTo(w) { return VOCAB.filter(v => v.wk <= w).flatMap(v => v.words); }

/* ---------- TTS ---------- */
let voiceCache = null;
function koVoice() {
  if (voiceCache !== null) return voiceCache;
  if (!('speechSynthesis' in window)) { voiceCache = false; return false; }
  const vs = speechSynthesis.getVoices();
  voiceCache = vs.find(v => (v.lang || '').toLowerCase().startsWith('ko')) || false;
  return voiceCache;
}
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => { voiceCache = null; koVoice(); };
}

function speak(text, rate) {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window)) { setTimeout(resolve, Math.max(1200, text.length * 180)); return; }
    try { speechSynthesis.cancel(); } catch (e) { }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = rate || S.settings.rate;
    const v = koVoice();
    if (v) u.voice = v;
    let done = false;
    const fin = () => { if (done) return; done = true; clearTimeout(timer); resolve(); };
    u.onend = fin; u.onerror = fin;
    const timer = setTimeout(fin, Math.max(1600, text.length * 260) + 900);
    speechSynthesis.speak(u);
  });
}

function stopSpeak() { if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) { } } }

/* ---------- router ---------- */
let VIEW = 'home';
let viewParam = null;

function go(v, p) {
  VIEW = v; viewParam = p || null;
  stopSpeak(); player.gen++;
  player.playing = false;
  render();
  window.scrollTo(0, 0);
}

function render() {
  const host = $('#view');
  const map = { home: renderHome, plan: renderPlan, basics: renderBasics, practice: renderPractice, commute: renderCommute, cards: renderCards };
  host.innerHTML = (map[VIEW] || renderHome)();
  $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.view === VIEW));
  paintStreak();
}

$('#tabbar').addEventListener('click', e => {
  const b = e.target.closest('.tab');
  if (b) go(b.dataset.view);
});

/* ---------- HOME ---------- */
function weekMinTotal() {
  const d = new Date();
  const dow = (d.getDay() + 6) % 7; // Mon=0
  let n = 0;
  for (let i = 0; i <= dow; i++) {
    const dd = new Date(d); dd.setDate(d.getDate() - i);
    n += S.minutes[`${dd.getFullYear()}-${pad(dd.getMonth() + 1)}-${pad(dd.getDate())}`] || 0;
  }
  return n;
}
function weekDayCount() {
  const d = new Date(); const dow = (d.getDay() + 6) % 7;
  let n = 0;
  for (let i = 0; i <= dow; i++) {
    const dd = new Date(d); dd.setDate(d.getDate() - i);
    const k = `${dd.getFullYear()}-${pad(dd.getMonth() + 1)}-${pad(dd.getDate())}`;
    if (S.minutes[k]) n++;
  }
  return n;
}

function renderHome() {
  const h = new Date().getHours();
  const greet = h < 6 ? '还没睡' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 19 ? '下午好' : '晚上好';
  const w = curWeek(), meta = weekMeta(w);
  const todayMin = S.minutes[todayStr()] || 0;
  const gap = S.last ? dayDiff(S.last, todayStr()) : 0;
  const back = gap >= 3;
  const wd = weekDayCount(), wm = weekMinTotal();

  const heroLabel = back ? '欢迎回来' : `第 ${w} 周 · ${meta.name}`;
  const heroTitle = back ? '断更了也没关系' : `${greet}，今天有多少时间？`;
  const heroDesc = back
    ? `已经有 ${gap} 天没打开。今天不需要学新内容，先花 5 分钟把之前的句子听回来就够了。`
    : meta.goal + '。地铁上听，坐下来练，各管一段。';
  const heroBtn = back ? '从复习开始' : '开始今日循环';

  return `
  <div class="hero">
    <p class="hero-label">${esc(heroLabel)}</p>
    <h1 class="hero-title">${esc(heroTitle)}</h1>
    <p class="hero-desc">${esc(heroDesc)}</p>
    <button class="hero-btn" data-act="start" type="button">${esc(heroBtn)}
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="hero-meta">
      <span>连续 <b>${S.streak}</b> 天</span>
      <span>今日 <b>${todayMin}</b> 分钟</span>
      <span>本周 <b>${wd}</b>/5 次</span>
    </div>
  </div>

  <h2 class="section">现在有多久</h2>
  <div class="dur-row">
    <button class="dur" data-min="5" type="button"><b>5</b><span>分钟</span></button>
    <button class="dur" data-min="15" type="button"><b>15</b><span>分钟</span></button>
    <button class="dur" data-min="30" type="button"><b>30</b><span>分钟</span></button>
    <button class="dur" data-min="60" type="button"><b>1</b><span>小时</span></button>
  </div>

  <h2 class="section">今天的四件事</h2>
  <button class="act" data-act="commute" type="button">
    <span class="act-ico"><svg viewBox="0 0 20 20"><path d="M10 3.2v9.4M6.4 6.8 10 3.2l3.6 3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13.2v1.6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></span>
    <span class="act-body"><span class="act-title">通勤音频 · 第 ${w} 周</span><span class="act-sub">${weekLines(w).length} 句 · 中文提示 + 韩语 + 跟读留白</span></span>
    <span class="act-arrow">›</span>
  </button>
  <button class="act" data-act="${weekGrammar(w).length ? 'grammar' : 'letters'}" type="button">
    <span class="act-ico"><svg viewBox="0 0 20 20"><path d="M4 3.5h5.2a2 2 0 0 1 2 2v11a1.6 1.6 0 0 0-1.6-1.6H4V3.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M16 3.5h-4.8a2 2 0 0 0-2 2v11a1.6 1.6 0 0 1 1.6-1.6H16V3.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg></span>
    <span class="act-body"><span class="act-title">${weekGrammar(w).length ? '本周语法 · ' + weekGrammar(w).length + ' 个句型' : '字母表 · 21 元音 + 19 辅音'}</span><span class="act-sub">${weekGrammar(w).length ? esc(weekGrammar(w).map(g => g.pat).join(' · ')) : '点开就能听发音，先建立字母和声音的对应'}</span></span>
    <span class="act-arrow">›</span>
  </button>
  <button class="act" data-act="${weekVocab(w).length ? 'vocab' : 'pron'}" type="button">
    <span class="act-ico"><svg viewBox="0 0 20 20"><rect x="3.4" y="5.6" width="13.2" height="9.6" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6.6 3.4h8.2a1.6 1.6 0 0 1 1.6 1.6v.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></span>
    <span class="act-body"><span class="act-title">${weekVocab(w).length ? '本周词汇 · ' + weekVocab(w).length + ' 个' : '发音规则 · 6 条核心变化'}</span><span class="act-sub">${weekVocab(w).length ? esc((VOCAB.find(v => v.wk === w) || {}).theme || '') : '连音、紧音、鼻音化——听懂口语的关键'}</span></span>
    <span class="act-arrow">›</span>
  </button>
  <button class="act" data-act="travel" type="button">
    <span class="act-ico"><svg viewBox="0 0 20 20"><path d="M10 2.5c.8 0 1.4.6 1.4 1.4v1.6l5.1 3v1.8l-5.1-1.5v3.4l2 1.5v1.5L10 14.2l-3.4 1v-1.5l2-1.5V8.8L3.5 10.3V8.5l5.1-3V3.9c0-.8.6-1.4 1.4-1.4Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></span>
    <span class="act-body"><span class="act-title">旅行场景 · 6 组</span><span class="act-sub">机场 · 车站 · 问路 · 酒店 · 点餐 · 求助</span></span>
    <span class="act-arrow">›</span>
  </button>
  <button class="act" data-act="practice" type="button">
    <span class="act-ico"><svg viewBox="0 0 20 20"><path d="M5 3.5h10a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 15V5A1.5 1.5 0 0 1 5 3.5Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m6.8 10.2 2.1 2.1 4.3-4.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <span class="act-body"><span class="act-title">练习题</span><span class="act-sub">词义 + 语法 + 发音，8 题一组</span></span>
    <span class="act-arrow">›</span>
  </button>

  <h2 class="section">本周进度</h2>
  <div class="card">
    <div class="row-between" style="margin-bottom:8px;">
      <span style="font-size:13px;font-weight:500;">第 ${w} 周 · ${esc(meta.name)}</span>
      <span class="tiny muted">${wd} / 5 次</span>
    </div>
    <div class="bar"><i style="width:${Math.min(100, wd / 5 * 100)}%"></i></div>
    <p class="tiny muted" style="margin:10px 0 0;">本周累计 ${wm} 分钟 · 目标：工作日至少 5 次短时接触</p>
  </div>

  <h2 class="section">累计</h2>
  <div class="stat-grid">
    <div class="stat"><b>${Object.keys(S.minutes).length}</b><span>学习天数</span></div>
    <div class="stat"><b>${Object.values(S.minutes).reduce((a, b) => a + b, 0)}</b><span>总分钟</span></div>
    <div class="stat"><b>${S.streak}</b><span>连续天数</span></div>
  </div>

  <p class="tiny muted" style="margin:22px 0 0;line-height:1.8;">
    数据存在这台设备的浏览器里，不会上传。${isStandalone() ? '' : '<br>iPhone 上建议：用 Safari 打开本页 → 分享 → 「添加到主屏幕」，之后就像 App 一样全屏使用。'}
  </p>`;
}

/* ---------- PLAN ---------- */
function renderPlan() {
  const w = curWeek();
  const items = WEEK_META.map(m => {
    const done = S.doneWeeks.includes(m.w);
    const cls = done ? 'is-done' : (m.w === w ? 'is-now' : '');
    const g = weekGrammar(m.w).length, v = weekVocab(m.w).length, l = weekLines(m.w).length;
    return `
    <div class="week ${cls}" data-week="${m.w}">
      <div class="wk-num">${done ? '✓' : m.w}</div>
      <div class="wk-body">
        <div class="wk-title">${esc(m.name)}</div>
        <div class="wk-goal">${esc(m.goal)}</div>
        <div class="wk-goal" style="margin-top:6px;color:var(--ink-3);">${g ? g + ' 个语法 · ' : ''}${v ? v + ' 个词 · ' : ''}${l} 句听力</div>
      </div>
    </div>`;
  }).join('');

  return `
  <h1 class="page-title">12 周路径</h1>
  <p class="page-sub">按你的节奏设计：工作日靠通勤听，周末坐下来补语法和练习。每周只要 5 次接触就够，不必每天。</p>

  <div class="notice welcome" style="margin-bottom:18px;">
    <svg viewBox="0 0 16 16" width="15" height="15" style="flex:none;margin-top:2px;"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7.2v4M8 5.1v.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
    <div>每天地铁约 1 小时是你最稳定的资产。建议把它固定成「听力时段」，坐下后的 15 分钟做语法和练习，两边不抢时间。</div>
  </div>

  <div class="week-list">${items}</div>

  <div style="margin-top:24px;">
    <button class="btn ghost wide" data-act="reset" type="button">重置学习进度</button>
  </div>`;
}

/* ---------- BASICS ---------- */
let basicTab = 'vowel';

function renderBasics() {
  const tabs = [['vowel', '元音'], ['cons', '辅音'], ['batchim', '收音'], ['pron', '发音'], ['gram', '语法'], ['vocab', '词汇']];
  let body = '';

  if (basicTab === 'vowel' || basicTab === 'cons') {
    const list = LETTERS[basicTab === 'vowel' ? 'vowels' : 'consonants'];
    body = `<div class="letter-grid">${list.map(x => `
      <button class="letter" data-letter="${esc(x.ch)}" data-side="${basicTab}" type="button">
        <div class="ch">${esc(x.ch)}</div>
        <div class="rm">${esc(x.rm)}</div>
        <div class="nm">${esc(x.nm)}</div>
      </button>`).join('')}</div>
      <p class="tiny muted" style="margin:14px 0 0;">点任意字母看发音要点，也可以直接听。</p>`;
  }

  if (basicTab === 'batchim') {
    body = `<div class="notice" style="margin-bottom:14px;">
      收音是韩语最难的部分，但其实只有 <b>7 个代表音</b>。所有收音最终都归到这七个之一。</div>
      ${BATCHIM.map(b => `
      <div class="detail">
        <div class="detail-h"><span class="ch">${esc(b.rep)}</span><span class="rm">来自 ${esc(b.from)}</span></div>
        <p>${esc(b.tip)}</p>
        <div class="ex"><span class="ko">${esc(b.ex)}</span><span class="cn">${esc(b.excn)}</span></div>
      </div>`).join('')}`;
  }

  if (basicTab === 'pron') {
    body = PRON_RULES.map(r => `
      <div class="gram">
        <div class="gram-top"><span class="gram-pat">${esc(r.name)}</span></div>
        <p class="gram-cn mono" style="font-size:12px;color:var(--ink-3);">${esc(r.pattern)}</p>
        <p class="gram-note">${esc(r.desc)}</p>
        <div class="gram-ex">${r.ex.map(e => `
          <div class="gex">
            <button class="speak" data-say="${esc(e.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="ko">${esc(e.ko)}</span>
            <span class="cn">${esc(e.rm)}　${esc(e.cn)}</span>
          </div>`).join('')}</div>
      </div>`).join('');
  }

  if (basicTab === 'gram') {
    const list = GRAMMAR.filter(g => g.wk <= curWeek());
    const byWk = {};
    list.forEach(g => { (byWk[g.wk] = byWk[g.wk] || []).push(g); });
    body = Object.keys(byWk).sort((a, b) => b - a).map(wk => `
      <h2 class="section">第 ${wk} 周 · ${esc(weekMeta(+wk).name)}</h2>
      ${byWk[wk].map(g => `
      <div class="gram">
        <div class="gram-top">
          <span class="gram-pat">${esc(g.pat)}</span>
          <span class="gram-wk">W${g.wk}</span>
        </div>
        <p class="gram-cn">${esc(g.cn)}</p>
        <p class="gram-note">${esc(g.note)}</p>
        <div class="gram-ex">${g.ex.map(e => `
          <div class="gex">
            <button class="speak" data-say="${esc(e.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="ko">${esc(e.ko)}</span>
          </div>
          <div style="padding-left:36px;font-size:12px;color:var(--ink-3);margin-top:-3px;">${esc(e.cn)}</div>`).join('')}</div>
      </div>`).join('')}`).join('');

    if (!list.length) {
      body = `<div class="empty">前两周不安排语法。<br>先把字母和收音吃透，第 3 周开始会有句型。</div>`;
    }
  }

  if (basicTab === 'vocab') {
    const list = VOCAB.filter(v => v.wk <= curWeek()).slice().reverse();
    body = list.map(g => `
      <h2 class="section">第 ${g.wk} 周 · ${esc(g.theme)}</h2>
      <div class="vocab-grid">
        ${g.words.map(w => `
          <div class="vrow">
            <button class="speak" data-say="${esc(w.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="vko">${esc(w.ko)}</span>
            <span class="vrm">${esc(w.rm)}</span>
            <span class="vcn">${esc(w.cn)}</span>
            ${w.hj ? `<span class="tag-hanja">${esc(w.hj)}</span>` : ''}
          </div>`).join('')}
      </div>`).join('');
    body += TRAVEL.map(s => `
      <h2 class="section">旅行 · ${esc(s.name)}</h2>
      <div class="vocab-grid">
        ${s.words.map(w => `
          <div class="vrow">
            <button class="speak" data-say="${esc(w.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="vko">${esc(w.ko)}</span>
            <span class="vrm">${esc(w.rm)}</span>
            <span class="vcn">${esc(w.cn)}</span>
            ${w.hj ? `<span class="tag-hanja">${esc(w.hj)}</span>` : ''}
          </div>`).join('')}
      </div>`).join('');
    body += `<p class="tiny muted" style="margin:16px 0 0;line-height:1.8;">
      带浅色标记的词和中文几乎一一对应，看到就能猜个八九成——这是中文母语者最大的便宜。</p>`;
    if (!list.length) {
      body = `<div class="empty">前两周不安排词汇。<br>字母还没认全的时候背单词效率很低，第 3 周开始按主题积累。</div>`;
    }
  }

  return `
  <h1 class="page-title">基础知识</h1>
  <p class="page-sub">字母 → 收音 → 发音 → 语法 → 词汇，按这个顺序走。前两块一周足够。</p>
  <div class="seg">${tabs.map(([k, n]) => `<button data-btab="${k}" class="${basicTab === k ? 'is-on' : ''}" type="button">${n}</button>`).join('')}</div>
  ${body}`;
}

function showLetter(ch, side) {
  const list = LETTERS[side === 'vowel' ? 'vowels' : 'consonants'];
  const x = list.find(i => i.ch === ch);
  if (!x) return;
  const host = $('#view');
  const old = $('#letterDetail');
  if (old) old.remove();
  const div = document.createElement('div');
  div.id = 'letterDetail';
  div.className = 'detail';
  div.style.marginTop = '14px';
  div.innerHTML = `
    <div class="detail-h"><span class="ch">${esc(x.ch)}</span><span class="rm">${esc(x.rm)} · ${esc(x.nm)}</span></div>
    <p>${esc(x.tip)}</p>
    <div class="ex row-between" style="align-items:center;">
      <div><span class="ko" style="font-weight:500;">${esc(x.ex)}</span><span class="cn" style="color:var(--ink-3);font-size:12px;margin-left:8px;">${esc(x.excn)}</span></div>
      <button class="speak" data-say="${esc(x.ex)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
    </div>`;
  const grid = $('.letter-grid', host);
  if (grid) grid.insertAdjacentElement('afterend', div);
  div.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  speak(x.ex);
}

/* ---------- PRACTICE ---------- */
let quiz = { list: [], i: 0, answered: false, right: 0, pick: null };

function buildQuiz(n) {
  const w = curWeek();
  const out = [];

  const travelWords = TRAVEL.flatMap(t => t.words);
  const words = allWordsUpTo(w).concat(travelWords);

  const vcount = w <= 2 ? Math.max(4, Math.floor(n / 2)) : Math.max(4, n - 2);
  if (words.length >= 4) {
    shuffle(words).slice(0, vcount).forEach(word => {
      const others = shuffle(words.filter(x => x.cn !== word.cn)).slice(0, 3).map(x => x.cn);
      const opts = shuffle([word.cn, ...others]);
      out.push({
        type: 'vocab', q: word.ko, hint: '选出正确的中文意思',
        opts, a: opts.indexOf(word.cn),
        exp: `${word.ko}（${word.rm}）= ${word.cn}`
      });
    });
  }

  if (w <= 2) {
    const pool = LETTERS.vowels.concat(LETTERS.consonants);
    shuffle(pool).slice(0, Math.max(0, n - out.length - 3)).forEach(x => {
      const others = shuffle(pool.filter(o => o.rm !== x.rm)).slice(0, 3).map(o => o.rm);
      const opts = shuffle([x.rm, ...others]);
      out.push({
        type: 'vocab', q: x.ch, hint: `这个字母读什么？（${esc(x.nm)}）`,
        opts, a: opts.indexOf(x.rm),
        exp: `${x.ch}（${x.nm}）= ${x.rm}。${x.tip}`
      });
    });
  }

  const gp = shuffle(QUIZ).slice(0, Math.max(1, n - out.length));
  gp.forEach(q => out.push(Object.assign({ type: 'gram' }, q)));

  return shuffle(out).slice(0, n);
}

function renderPractice() {
  if (!quiz.list.length) {
    return `<h1 class="page-title">练习</h1>
    <p class="page-sub">从词义、语法、发音三个角度检验。答错会进入复习队列。</p>
    <div class="card" style="text-align:center;padding:30px 20px;">
      <div style="font-size:15px;font-weight:500;margin-bottom:6px;">准备好了吗</div>
      <p class="tiny muted" style="margin:0 0 18px;">第 ${curWeek()} 周范围 · 8 道题 · 大约 5 分钟</p>
      <button class="btn" data-act="begin" type="button">开始练习</button>
    </div>`;
  }

  if (quiz.i >= quiz.list.length) return renderResult();

  const q = quiz.list[quiz.i];
  const keys = ['A', 'B', 'C', 'D'];

  return `
  <div class="q-top">
    <span class="q-cnt">${quiz.i + 1} / ${quiz.list.length}</span>
    <span class="q-cnt">${q.type === 'vocab' ? '词义' : '语法'}</span>
  </div>
  <div class="bar thin" style="margin-bottom:18px;"><i style="width:${(quiz.i / quiz.list.length) * 100}%"></i></div>

  <div class="q-card">
    <p class="q-prompt">${esc(q.q)}</p>
    <p class="q-hint">${esc(q.hint || '选出正确答案')}</p>
    <div class="q-opts">
      ${q.opts.map((o, idx) => {
        let cls = '';
        if (quiz.answered) {
          if (idx === q.a) cls = 'is-right';
          else if (idx === quiz.pick) cls = 'is-wrong';
        }
        return `<button class="q-opt ${cls}" data-opt="${idx}" ${quiz.answered ? 'disabled' : ''} type="button">
          <span class="key">${keys[idx]}</span><span>${esc(o)}</span></button>`;
      }).join('')}
    </div>
    ${quiz.answered ? `<div class="feedback ${quiz.pick === q.a ? 'ok' : 'no'}">
      <b>${quiz.pick === q.a ? '答对了' : '正确答案：' + esc(q.opts[q.a])}</b><br>${esc(q.exp || '')}
    </div>
    <button class="btn wide" data-act="next" type="button">${quiz.i + 1 === quiz.list.length ? '看结果' : '下一题'}</button>` : ''}
  </div>`;
}

function renderResult() {
  const total = quiz.list.length;
  const acc = total ? Math.round(quiz.right / total * 100) : 0;
  const msg = acc >= 90 ? '很稳，可以往前走了。' : acc >= 70 ? '基础在，错的几题多听两遍就好。' : acc >= 50 ? '正常进度，别急，明天再来一组。' : '先回到语法页把句型过一遍，再来。';
  return `
  <div class="result-hero">
    <div class="result-num">${acc}<small>%</small></div>
    <p class="result-txt">${total} 题答对 ${quiz.right} 题<br>${esc(msg)}</p>
  </div>
  <div class="card">
    <div class="row-between"><span style="font-size:13px;">累计正确率</span>
      <span style="font-weight:500;">${S.quiz.total ? Math.round(S.quiz.right / S.quiz.total * 100) : 0}%</span></div>
  </div>
  <button class="btn wide" data-act="again" type="button">再来一组</button>
  <button class="btn ghost wide" data-act="toGrammar" type="button">回语法页复习</button>`;
}

function startQuiz(n) {
  quiz = { list: buildQuiz(n || 8), i: 0, answered: false, right: 0, pick: null };
  go('practice');
}

function pickOption(idx) {
  if (quiz.answered) return;
  const q = quiz.list[quiz.i];
  quiz.answered = true; quiz.pick = idx;
  const ok = idx === q.a;
  if (ok) quiz.right++;
  S.quiz.total++; if (ok) S.quiz.right++;
  if (!ok && q.type === 'vocab') {
    const key = 'w:' + q.q;
    S.srs[key] = { box: 1, due: todayStr(), cn: q.opts[q.a] };
  }
  save();
  render();
}

/* ---------- COMMUTE ---------- */
const player = { list: [], i: 0, playing: false, gen: 0 };

function initPlayer() {
  player.list = playerLines();
  if (!player.list.length) player.list = LINES.slice(0, 6);
  if (player.i >= player.list.length) player.i = 0;
}

function renderCommute() {
  if (!player.list.length) initPlayer();
  const w = curWeek();
  const hasVoice = !!koVoice();
  const item = player.list[Math.min(player.i, player.list.length - 1)] || { ko: '', cn: '', rm: '' };
  const blind = S.settings.blind;

  return `
  <h1 class="page-title">通勤模式</h1>
  <p class="page-sub">不用看屏幕，戴上耳机就行。中文提示 → 韩语朗读 → 留白给你跟读。</p>

  ${hasVoice ? '' : `<div class="notice" style="margin-bottom:14px;">
    这台设备上没有找到韩语语音包，朗读会退化成静音计时。可以在系统设置里添加韩语语音后再试。</div>`}

  <div class="player">
    <div class="pl-idx">${esc(playerLabel())} · ${player.i + 1} / ${player.list.length}</div>
    <div class="pl-cn">${esc(item.cn)}</div>
    <div class="pl-ko ${blind ? 'is-hidden' : ''}" id="plKo">${esc(item.ko)}</div>
    <div class="pl-rm">${blind ? '' : esc(item.rm)}</div>
    <div class="pl-ctrl">
      <button class="pl-btn" data-pl="prev" type="button" aria-label="上一句">
        <svg viewBox="0 0 20 20"><path d="M12.5 5.5 8 10l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="pl-btn pl-play" data-pl="toggle" type="button" aria-label="播放">
        ${player.playing
      ? `<svg viewBox="0 0 24 24"><path d="M8.5 6.5h2.2v11H8.5zM13.3 6.5h2.2v11h-2.2z" fill="currentColor"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M8.5 5.8 18 12l-9.5 6.2V5.8Z" fill="currentColor"/></svg>`}
      </button>
      <button class="pl-btn" data-pl="next" type="button" aria-label="下一句">
        <svg viewBox="0 0 20 20"><path d="M7.5 5.5 12 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="pl-bar"><i style="width:${(player.i / player.list.length) * 100}%"></i></div>
  </div>

  <h2 class="section">播放内容</h2>
  <div style="display:flex;flex-wrap:wrap;gap:8px;">
    <button class="opt-pill ${!S.settings.scene || S.settings.scene === 'week' ? 'is-on' : ''}" data-scene="week" type="button">第 ${w} 周课程句</button>
    ${TRAVEL.map(s => `<button class="opt-pill ${S.settings.scene === s.id ? 'is-on' : ''}" data-scene="${s.id}" type="button">${s.name}</button>`).join('')}
  </div>

  <h2 class="section">播放设置</h2>
  <div style="display:flex;flex-wrap:wrap;gap:8px;">
    <button class="opt-pill ${blind ? 'is-on' : ''}" data-set="blind" type="button">盲听（隐藏文字）</button>
    <button class="opt-pill ${S.settings.loop ? 'is-on' : ''}" data-set="loop" type="button">循环播放</button>
    <button class="opt-pill ${S.settings.rate < 0.9 ? 'is-on' : ''}" data-set="slow" type="button">慢速</button>
  </div>

  <h2 class="section">跟读留白</h2>
  <div class="card">
    <p class="tiny muted" style="margin:0 0 10px;">读完一句后停顿多久，留给你自己念一遍。</p>
    <div style="display:flex;gap:8px;">
      ${[[1600, '1.6 秒（快）'], [2600, '2.6 秒（推荐）'], [3800, '3.8 秒（慢）']].map(([ms, label]) =>
        `<button class="opt-pill ${S.settings.gap === ms ? 'is-on' : ''}" data-gap="${ms}" type="button">${label}</button>`).join('')}
    </div>
  </div>

  <h2 class="section">全部句子</h2>
  <div class="card" style="padding:6px 16px;">
    ${player.list.map((l, idx) => `
      <div class="sheet-item">
        <button class="speak" data-say="${esc(l.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
        <button class="ko" data-jump="${idx}" type="button" style="text-align:left;background:none;border:none;padding:0;font:inherit;font-size:14px;font-weight:500;flex:1;cursor:pointer;">${esc(l.ko)}</button>
        <span class="cn">${esc(l.cn)}</span>
      </div>`).join('')}
  </div>`;
}

async function playLoop() {
  const my = ++player.gen;
  player.playing = true;
  refreshPlayerUI();
  while (player.playing && my === player.gen) {
    const item = player.list[player.i];
    if (!item) break;
    refreshPlayerCard();
    await sleep(700);
    if (my !== player.gen) return;
    await speak(item.ko, S.settings.rate);
    if (my !== player.gen) return;
    await sleep(S.settings.gap);
    if (my !== player.gen) return;
    player.i++;
    if (player.i >= player.list.length) {
      if (S.settings.loop) { player.i = 0; }
      else { player.i = player.list.length - 1; player.playing = false; break; }
    }
  }
  player.playing = false;
  refreshPlayerUI();
}

function refreshPlayerUI() {
  const btn = $('[data-pl="toggle"]');
  if (!btn) return;
  btn.innerHTML = player.playing
    ? `<svg viewBox="0 0 24 24"><path d="M8.5 6.5h2.2v11H8.5zM13.3 6.5h2.2v11h-2.2z" fill="currentColor"/></svg>`
    : `<svg viewBox="0 0 24 24"><path d="M8.5 5.8 18 12l-9.5 6.2V5.8Z" fill="currentColor"/></svg>`;
}

function refreshPlayerCard() {
  const item = player.list[player.i];
  if (!item) return;
  const cn = $('.pl-cn'), ko = $('#plKo'), rm = $('.pl-rm'), idx = $('.pl-idx'), bar = $('.pl-bar > i');
  if (cn) cn.textContent = item.cn;
  if (ko) ko.textContent = item.ko;
  if (rm) rm.textContent = S.settings.blind ? '' : item.rm;
  if (idx) idx.textContent = `${playerLabel()} · ${player.i + 1} / ${player.list.length}`;
  if (bar) bar.style.width = (player.i / player.list.length) * 100 + '%';
}

function togglePlay() {
  if (player.playing) { player.playing = false; player.gen++; stopSpeak(); refreshPlayerUI(); }
  else { logStudy(3); playLoop(); }
}

/* ---------- CARDS ---------- */
function renderCards() {
  const travel = TRAVEL.map(s => `
    <div class="sheet-group">
      <h2 class="sheet-h">${esc(s.name)} · ${s.words.length} 个词 / ${s.lines.length} 句</h2>
      <div class="card" style="padding:4px 16px;">
        ${s.words.map(w => `
          <div class="sheet-item">
            <button class="speak" data-say="${esc(w.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="ko">${esc(w.ko)}</span>
            <span class="cn">${esc(w.rm)}　${esc(w.cn)}</span>
          </div>`).join('')}
      </div>
      <div class="card" style="padding:4px 16px;margin-top:8px;">
        ${s.lines.map(it => `
          <div class="sheet-item">
            <button class="speak" data-say="${esc(it.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="ko">${esc(it.ko)}</span>
            <span class="cn">${esc(it.cn)}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');

  const work = CHEATS.map(g => `
    <div class="sheet-group">
      <h2 class="sheet-h">${esc(g.group)}</h2>
      <div class="card" style="padding:4px 16px;">
        ${g.items.map(it => `
          <div class="sheet-item">
            <button class="speak" data-say="${esc(it.ko)}" type="button" aria-label="朗读"><svg viewBox="0 0 16 16"><path d="M6 3.2 3.4 5.4H1.8v5.2h1.6L6 12.8V3.2Z" fill="currentColor"/><path d="M9.2 5.6a3.4 3.4 0 0 1 0 4.8M11.2 3.9a6.2 6.2 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
            <span class="ko">${esc(it.ko)}</span>
            <span class="cn">${esc(it.cn)}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');

  return `
  <h1 class="page-title">场景速查</h1>
  <p class="page-sub">不要求背，出发前翻出来听几遍就行。上半部分是旅行，下半部分是工作。</p>
  <h2 class="section">旅行</h2>
  ${travel}
  <h2 class="section">工作</h2>
  ${work}`;
}

/* ---------- bind ---------- */
function bindView() {
  const host = $('#view');

  host.addEventListener('click', e => {
    const t = e.target;

    const say = t.closest('[data-say]');
    if (say) { speak(say.dataset.say, S.settings.rate); return; }

    const dur = t.closest('[data-min]');
    if (dur) {
      const n = +dur.dataset.min;
      $$('.dur', host).forEach(d => d.classList.toggle('is-pick', d === dur));
      startQuiz(n <= 5 ? 5 : n <= 15 ? 8 : n <= 30 ? 12 : 18);
      return;
    }

    const act = t.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'start') {
        const back = S.last && dayDiff(S.last, todayStr()) >= 3;
        if (back) { go('commute'); } else startQuiz(8);
        logStudy(1);
      }
      if (a === 'commute') go('commute');
      if (a === 'travel') go('cards');
      if (a === 'grammar') { basicTab = 'gram'; go('basics'); }
      if (a === 'vocab') { basicTab = 'vocab'; go('basics'); }
      if (a === 'letters') { basicTab = 'vowel'; go('basics'); }
      if (a === 'pron') { basicTab = 'pron'; go('basics'); }
      if (a === 'practice' || a === 'begin') startQuiz(8);
      if (a === 'next') { quiz.i++; quiz.answered = false; quiz.pick = null; render(); }
      if (a === 'again') startQuiz(8);
      if (a === 'toGrammar') { basicTab = 'gram'; go('basics'); }
      if (a === 'reset') {
        if (confirm('确定清空所有学习记录？')) { localStorage.removeItem(KEY); S = JSON.parse(JSON.stringify(DEF)); save(); go('home'); }
      }
      return;
    }

    const lt = t.closest('[data-letter]');
    if (lt) { showLetter(lt.dataset.letter, lt.dataset.side); return; }

    const bt = t.closest('[data-btab]');
    if (bt) { basicTab = bt.dataset.btab; render(); return; }

    const opt = t.closest('[data-opt]');
    if (opt) { pickOption(+opt.dataset.opt); return; }

    const wk = t.closest('[data-week]');
    if (wk) {
      const w = +wk.dataset.week;
      S.currentWeek = w; save(); player.i = 0; initPlayer();
      render();
      return;
    }

    const pl = t.closest('[data-pl]');
    if (pl) {
      const k = pl.dataset.pl;
      if (k === 'toggle') togglePlay();
      if (k === 'next') { player.i = Math.min(player.list.length - 1, player.i + 1); refreshPlayerCard(); if (!player.playing) speak(player.list[player.i].ko, S.settings.rate); }
      if (k === 'prev') { player.i = Math.max(0, player.i - 1); refreshPlayerCard(); if (!player.playing) speak(player.list[player.i].ko, S.settings.rate); }
      return;
    }

    const set = t.closest('[data-set]');
    if (set) {
      const k = set.dataset.set;
      if (k === 'blind') S.settings.blind = !S.settings.blind;
      if (k === 'loop') S.settings.loop = !S.settings.loop;
      if (k === 'slow') S.settings.rate = S.settings.rate < 0.9 ? 0.92 : 0.72;
      save(); render();
      return;
    }

    const gap = t.closest('[data-gap]');
    if (gap) { S.settings.gap = +gap.dataset.gap; save(); render(); return; }

    const sc = t.closest('[data-scene]');
    if (sc) {
      S.settings.scene = sc.dataset.scene;
      save();
      player.playing = false; player.gen++; stopSpeak();
      player.i = 0; initPlayer();
      render();
      return;
    }

    const jump = t.closest('[data-jump]');
    if (jump) {
      player.i = +jump.dataset.jump;
      refreshPlayerCard();
      speak(player.list[player.i].ko, S.settings.rate);
      return;
    }
  });
}

/* ---------- init ---------- */
initPlayer();
paintStreak();
bindView();
render();

// 首次使用时把语音引擎预热，否则 iOS/Safari 需要用户手势后才可用
document.addEventListener('click', function warm() {
  try { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch (e) { }
  document.removeEventListener('click', warm);
}, { once: true });
