// VLearn — Ôn tập cá nhân hoá — app logic (file mới, tách ra khỏi index.html)
// Giữ nguyên toàn bộ nguyên tắc AI (system prompt, non-goals, xử lý lớp mơ hồ) từ bản gốc,
// chỉ mở rộng UI/UX: dashboard, tìm kiếm/lọc, citation popover, lịch sử, theme, toast, cài đặt.

(function () {
  'use strict';

  // ---------------- State ----------------
  let DATA = [];
  let GROUPS = {};
  let GROUP_META = []; // [{key, uid, dc, turns, noCiteCount, noCitePct}]
  let TRANSCRIPT_CHUNKS = {};
  let currentKey = null;
  let currentTurnFilter = 'all';
  let currentTurnSearch = '';
  let currentReviewText = '';
  let currentReviewMeta = null;

  const LS_KEYS = {
    theme: 'vlearn_theme',
    apiKey: 'vlearn_api_key',
    model: 'vlearn_model',
    history: 'vlearn_review_history'
  };

  const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
  const DEFAULT_MODEL = 'openai/gpt-4o';

  // Mapping day_code -> mã prefix transcript tương ứng (giữ nguyên từ bản gốc)
  const DAY_CODE_TO_TRANSCRIPT_PREFIX = {
    'Lecture_material_ms203vsq_ob7vqp': ['T01', 'T05'],
    'day02-c301': ['T02'],
  };

  // ---------------- DOM helpers ----------------
  const $ = (id) => document.getElementById(id);
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------------- Theme ----------------
  function initTheme() {
    const saved = localStorage.getItem(LS_KEYS.theme);
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    updateThemeIcon();
  }
  function updateThemeIcon() {
    const saved = localStorage.getItem(LS_KEYS.theme);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    $('themeToggle').textContent = isDark ? '☀️' : '🌙';
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(LS_KEYS.theme, next);
    updateThemeIcon();
  }

  // ---------------- Toasts ----------------
  function toast(msg, type) {
    const stack = $('toastStack');
    const t = el('div', 'toast' + (type ? ' ' + type : ''), msg);
    stack.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .25s'; }, 2800);
    setTimeout(() => t.remove(), 3100);
  }

  // ---------------- Data loading ----------------
  async function loadData() {
    try {
      const res = await fetch('demo_data.json');
      DATA = await res.json();
    } catch (e) {
      toast('Không tải được demo_data.json', 'error');
      return;
    }
    GROUPS = {};
    DATA.forEach(r => {
      const key = r.user_id + '||' + r.day_code;
      if (!GROUPS[key]) GROUPS[key] = [];
      GROUPS[key].push(r);
    });
    GROUP_META = Object.keys(GROUPS).map(key => {
      const [uid, dc] = key.split('||');
      const turns = GROUPS[key];
      const noCiteCount = turns.filter(t => t.no_cite).length;
      return { key, uid, dc, turns, noCiteCount, noCitePct: Math.round(noCiteCount / turns.length * 100) };
    });
    window.GROUPS = GROUPS;

    renderDashboard();
    renderGroupList();
    if (GROUP_META.length) selectGroup(GROUP_META[0].key);
  }

  async function loadTranscriptChunks() {
    try {
      const res = await fetch('transcript_chunks.json');
      TRANSCRIPT_CHUNKS = await res.json();
    } catch (e) {
      console.warn('Chưa có transcript_chunks.json — AI sẽ chạy ở chế độ không có nguồn thật (chỉ để test flow).');
    }
  }

  // ---------------- Dashboard ----------------
  function renderDashboard() {
    const card = $('dashCard');
    card.innerHTML = '';
    card.appendChild(el('h3', null, 'Tổng quan dữ liệu'));

    const totalTurns = DATA.length;
    const totalNoCite = DATA.filter(t => t.no_cite).length;
    const totalGroups = GROUP_META.length;
    const pct = totalTurns ? Math.round(totalNoCite / totalTurns * 100) : 0;

    const stats = el('div', 'dash-stats');
    const s1 = el('div', 'dash-stat');
    s1.appendChild(el('div', 'num', String(totalGroups)));
    s1.appendChild(el('div', 'lbl', 'nhóm (học viên × bài)'));
    const s2 = el('div', 'dash-stat');
    s2.appendChild(el('div', 'num', String(totalTurns)));
    s2.appendChild(el('div', 'lbl', 'lượt hỏi'));
    const s3 = el('div', 'dash-stat');
    s3.appendChild(el('div', 'num', pct + '%'));
    s3.appendChild(el('div', 'lbl', 'không trích dẫn'));
    const s4 = el('div', 'dash-stat');
    s4.appendChild(el('div', 'num', String(totalNoCite)));
    s4.appendChild(el('div', 'lbl', 'lượt thiếu căn cứ'));
    stats.appendChild(s1); stats.appendChild(s2); stats.appendChild(s3); stats.appendChild(s4);
    card.appendChild(stats);

    // Per day_code breakdown
    const byLecture = {};
    DATA.forEach(t => {
      if (!byLecture[t.day_code]) byLecture[t.day_code] = { total: 0, noCite: 0 };
      byLecture[t.day_code].total++;
      if (t.no_cite) byLecture[t.day_code].noCite++;
    });
    const lectureBreakdown = el('div');
    Object.entries(byLecture).forEach(([dc, v]) => {
      const p = Math.round(v.noCite / v.total * 100);
      const row = el('div', 'lecture-bar-row');
      const lblRow = el('div', 'lbl-row');
      const b = document.createElement('b');
      b.textContent = shortenDayCode(dc);
      lblRow.appendChild(b);
      lblRow.appendChild(document.createTextNode(p + '% không trích dẫn'));
      const track = el('div', 'bar-track');
      const fill = el('div', 'bar-fill');
      fill.style.width = p + '%';
      track.appendChild(fill);
      row.appendChild(lblRow);
      row.appendChild(track);
      lectureBreakdown.appendChild(row);
    });
    card.appendChild(lectureBreakdown);
  }

  function shortenDayCode(dc) {
    if (dc === 'New learning material') return '⚠️ Bài chưa xác định';
    if (dc.length > 26) return dc.slice(0, 24) + '…';
    return dc;
  }

  // ---------------- Group list (sidebar) ----------------
  function renderGroupList() {
    const listEl = $('groupList');
    const search = ($('groupSearch').value || '').trim().toLowerCase();
    const sortMode = $('sortSelect').value;

    let items = GROUP_META.filter(g => !search || g.uid.toLowerCase().includes(search) || g.dc.toLowerCase().includes(search));

    items = items.slice().sort((a, b) => {
      if (sortMode === 'nocite_desc') return b.noCitePct - a.noCitePct || b.turns.length - a.turns.length;
      if (sortMode === 'turns_desc') return b.turns.length - a.turns.length;
      if (sortMode === 'name_asc') return a.uid.localeCompare(b.uid);
      return 0;
    });

    listEl.innerHTML = '';
    if (!items.length) {
      listEl.appendChild(el('div', 'empty-hint', 'Không tìm thấy nhóm phù hợp.'));
      return;
    }

    items.forEach(g => {
      const item = el('div', 'group-item' + (g.key === currentKey ? ' active' : ''));
      const top = el('div', 'gi-top');
      top.appendChild(el('span', null, g.uid));
      const badgeClass = g.noCitePct >= 50 ? 'hi' : g.noCitePct >= 20 ? 'mid' : 'lo';
      top.appendChild(el('span', 'gi-badge ' + badgeClass, g.noCitePct + '%'));
      item.appendChild(top);
      item.appendChild(el('div', 'gi-sub', `${shortenDayCode(g.dc)} · ${g.turns.length} lượt hỏi`));
      item.addEventListener('click', () => selectGroup(g.key));
      listEl.appendChild(item);
    });
  }

  function selectGroup(key) {
    currentKey = key;
    currentTurnFilter = 'all';
    currentTurnSearch = '';
    $('turnSearch').value = '';
    document.querySelectorAll('#citeFilter .chip').forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
    renderGroupList();
    renderGroupHeader();
    renderTurnList();
    resetReviewPanel();
    renderHistoryList();
  }

  function renderGroupHeader() {
    const g = GROUP_META.find(x => x.key === currentKey);
    const header = $('groupHeader');
    header.innerHTML = '';
    if (!g) { header.appendChild(el('div', 'sub', 'Chưa có nhóm nào để hiển thị.')); return; }
    header.appendChild(el('h1', null, `${g.uid} · ${shortenDayCode(g.dc)}`));
    header.appendChild(el('div', 'sub',
      `${g.turns.length} lượt hỏi trong bài này · ${g.noCiteCount} lượt (${g.noCitePct}%) tutor trả lời KHÔNG có trích dẫn`));
  }

  // ---------------- Turn list ----------------
  function renderTurnList() {
    const g = GROUP_META.find(x => x.key === currentKey);
    const listEl = $('turnList');
    listEl.innerHTML = '';
    if (!g) return;

    let turns = g.turns;
    if (currentTurnFilter === 'cited') turns = turns.filter(t => !t.no_cite);
    if (currentTurnFilter === 'no_cite') turns = turns.filter(t => t.no_cite);
    const term = currentTurnSearch.trim().toLowerCase();
    if (term) {
      turns = turns.filter(t =>
        (t.question_excerpt || '').toLowerCase().includes(term) ||
        (t.answer_excerpt || '').toLowerCase().includes(term));
    }

    if (!turns.length) {
      listEl.appendChild(el('div', 'empty-hint', 'Không có lượt hỏi nào khớp bộ lọc.'));
      return;
    }

    turns.forEach(t => {
      const div = el('div', 'turn ' + (t.no_cite ? 'no-cite' : 'cited'));
      const qLine = el('div', 'q');
      appendHighlighted(qLine, t.question_excerpt || '', term);
      const badge = el('span', 'badge ' + (t.no_cite ? 'no-cite' : 'cited'),
        t.no_cite ? 'không trích dẫn' : 'có trích dẫn ' + t.citations);
      qLine.appendChild(document.createTextNode(' '));
      qLine.appendChild(badge);
      const aLine = el('div', 'a');
      appendHighlighted(aLine, t.answer_excerpt || '', term);
      div.appendChild(qLine);
      div.appendChild(aLine);
      div.appendChild(el('div', 'turn-meta', t.turn_id));
      listEl.appendChild(div);
    });
  }

  function appendHighlighted(container, text, term) {
    if (!term) { container.appendChild(document.createTextNode(text)); return; }
    const lower = text.toLowerCase();
    let idx = 0, pos;
    while ((pos = lower.indexOf(term, idx)) !== -1) {
      if (pos > idx) container.appendChild(document.createTextNode(text.slice(idx, pos)));
      const mark = document.createElement('mark');
      mark.className = 'hit';
      mark.textContent = text.slice(pos, pos + term.length);
      container.appendChild(mark);
      idx = pos + term.length;
    }
    if (idx < text.length) container.appendChild(document.createTextNode(text.slice(idx)));
  }

  // ---------------- Tabs ----------------
  function initTabs() {
    document.querySelectorAll('.tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tabBtn.classList.add('active');
        $('panel-' + tabBtn.dataset.tab).classList.add('active');
      });
    });
  }

  // ---------------- Review generation ----------------
  function resetReviewPanel() {
    currentReviewText = '';
    currentReviewMeta = null;
    const box = $('reviewBox');
    box.className = 'review-box empty';
    box.textContent = 'Bấm "Sinh bản ôn tập" để tổng hợp các điểm cần ôn lại cho nhóm này, có trích dẫn từ transcript gốc.';
    $('copyBtn').disabled = true;
    $('downloadBtn').disabled = true;
  }

  function getEffectiveApiKey() {
    return window.OPENROUTER_API_KEY || localStorage.getItem(LS_KEYS.apiKey) || window.__RUNTIME_KEY || '';
  }
  function getEffectiveModel() {
    return localStorage.getItem(LS_KEYS.model) || DEFAULT_MODEL;
  }

  async function generateReview() {
    const g = GROUP_META.find(x => x.key === currentKey);
    if (!g) return;
    const { uid, dc, turns } = g;
    const noCite = turns.filter(t => t.no_cite);
    const box = $('reviewBox');
    box.className = 'review-box';

    // ② Lớp mơ hồ — day_code placeholder, không map được bài giảng
    if (dc === 'New learning material') {
      setReviewPlainText('⚠️ Chưa xác định được bài giảng cho nhóm này (day_code là placeholder hệ thống). Không thể sinh bản ôn tập có căn cứ — vui lòng chọn nhóm khác.');
      return;
    }
    // ② Lớp mơ hồ — chưa đủ dữ liệu
    if (turns.length < 3) {
      setReviewPlainText('Chưa đủ dữ liệu (cần ≥3 lượt hỏi trong cùng bài giảng) để tổng hợp ôn tập có ý nghĩa cho nhóm này.');
      return;
    }

    const apiKey = getEffectiveApiKey();
    if (!apiKey) {
      toast('Chưa có API key — mở Cài đặt để nhập key rồi thử lại.', 'error');
      openSettings(true);
      setReviewPlainText('Cần API key để gọi AI thật. Mở ⚙️ Cài đặt, nhập OpenRouter API key rồi bấm "Sinh bản ôn tập" lại.');
      return;
    }

    box.innerHTML = '';
    const loadingLine = el('div', null);
    const sp = el('span', 'spinner'); sp.style.borderTopColor = 'var(--primary)'; sp.style.borderColor = 'color-mix(in srgb, var(--primary) 30%, transparent)';
    loadingLine.appendChild(sp);
    loadingLine.appendChild(document.createTextNode(`Đang gọi AI thật (${getEffectiveModel()} qua OpenRouter), đối chiếu transcript...`));
    box.appendChild(loadingLine);
    $('genBtn').disabled = true;

    const relevantPrefixes = DAY_CODE_TO_TRANSCRIPT_PREFIX[dc] || [];
    const contextChunks = Object.entries(TRANSCRIPT_CHUNKS)
      .filter(([code]) => relevantPrefixes.some(p => code.startsWith(p)))
      .map(([code, text]) => `[${code}] ${text}`)
      .join('\n\n');

    const questionsList = noCite.map(t => `- (${t.turn_id}) ${t.question_excerpt}`).join('\n');

    const systemInstruction = `Bạn là trợ lý tổng hợp ôn tập cho học viên. NGUYÊN TẮC BẮT BUỘC:
1. CHỈ dùng nội dung trong phần TRANSCRIPT được cung cấp bên dưới — không dùng kiến thức ngoài.
2. Nếu không tìm thấy đoạn transcript support cho một câu hỏi, PHẢI nói rõ "không tìm thấy căn cứ trong tài liệu" cho câu đó — không được bịa.
3. Mọi thông tin đưa ra phải kèm mã đoạn trích dẫn dạng [Txx-NNN] lấy từ transcript.
4. KHÔNG chấm điểm, đánh giá năng lực học viên dưới bất kỳ hình thức nào (kể cả cho điểm số, nhận xét đúng/sai bài làm).
5. KHÔNG được viết lại, tóm tắt lại, hay tái cấu trúc toàn bộ nội dung bài giảng thành một phiên bản mới thay thế — kể cả khi học viên yêu cầu trực tiếp "viết lại cho dễ hiểu hơn". Nếu học viên yêu cầu việc này, PHẢI từ chối và giải thích: chỉ có thể trả lời câu hỏi cụ thể có trích dẫn, không tạo bản thay thế cho bài giảng gốc.
6. KHÔNG cung cấp thông tin cá nhân/liên hệ của học viên khác.
7. Nếu TRANSCRIPT rỗng hoặc không đủ, báo rõ giới hạn này thay vì tự sinh nội dung.
8. Khi trình bày dưới dạng danh sách/định nghĩa có cấu trúc rõ ràng (ví dụ đánh số "4 câu hỏi trọng tâm", định nghĩa chính thức của một thuật ngữ), CHỈ dùng cấu trúc đó nếu transcript có sẵn cấu trúc tương tự. Nếu bạn đang tự tổng hợp/diễn giải từ nhiều câu rời rạc thành một cấu trúc mới, PHẢI ghi rõ "(tổng hợp/diễn giải, không phải nguyên văn)" ngay sau phần đó.

TRANSCRIPT:
${contextChunks || '(không có transcript — báo rõ giới hạn này)'}

CÁC CÂU HỎI HỌC VIÊN ĐÃ HỎI LẠI NHIỀU LẦN (cần ôn tập):
${questionsList}

Hãy sinh bản ôn tập ngắn gọn, mỗi điểm kèm mã đoạn trích dẫn thật.`;

    try {
      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'VLearn On tap ca nhan hoa'
        },
        body: JSON.stringify({
          model: getEffectiveModel(),
          messages: [{ role: 'user', content: systemInstruction }]
        })
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || '(AI không trả về nội dung — kiểm tra API key/quota)';
      const full = `📘 Ôn tập cho ${uid} — bài "${shortenDayCode(dc)}"\n\n${text}`;
      setReviewRich(full);
      saveHistoryEntry({ uid, dc, key: currentKey, model: getEffectiveModel(), text: full });
      toast('Đã sinh bản ôn tập mới.', 'success');
    } catch (err) {
      setReviewPlainText('❌ Lỗi khi gọi AI: ' + err.message + '\n(Kiểm tra API key hoặc kết nối mạng)');
      toast('Lỗi khi gọi AI: ' + err.message, 'error');
    } finally {
      $('genBtn').disabled = false;
    }
  }

  function setReviewPlainText(text) {
    const box = $('reviewBox');
    box.className = 'review-box';
    box.textContent = text;
    currentReviewText = text;
    $('copyBtn').disabled = true;
    $('downloadBtn').disabled = true;
  }

  // Xây DOM an toàn: KHÔNG dùng innerHTML với nội dung AI trả về — chỉ tách citation code thành span
  // qua createTextNode/createElement, tránh nguy cơ AI trả về chuỗi có ký tự HTML.
  function setReviewRich(text) {
    const box = $('reviewBox');
    box.className = 'review-box';
    box.innerHTML = '';
    renderReviewText(box, text);
    currentReviewText = text;
    $('copyBtn').disabled = false;
    $('downloadBtn').disabled = false;
  }

  function renderReviewText(container, text) {
    const groupRe = /\[\s*T\d{2}-\d{3}(?:\s*,\s*T\d{2}-\d{3})*\s*\]/g;
    let lastIndex = 0, m;
    while ((m = groupRe.exec(text)) !== null) {
      if (m.index > lastIndex) container.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
      const codes = m[0].match(/T\d{2}-\d{3}/g) || [];
      codes.forEach((code, i) => {
        const chip = el('span', 'citation-chip', '[' + code + ']');
        chip.dataset.code = code;
        chip.addEventListener('click', (ev) => showCitationPopover(ev, code));
        container.appendChild(chip);
        if (i < codes.length - 1) container.appendChild(document.createTextNode(' '));
      });
      lastIndex = groupRe.lastIndex;
    }
    if (lastIndex < text.length) container.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  function showCitationPopover(ev, code) {
    ev.stopPropagation();
    const pop = $('citationPopover');
    const content = TRANSCRIPT_CHUNKS[code];
    pop.innerHTML = '';
    pop.appendChild(el('span', 'cp-code', '📌 ' + code));
    pop.appendChild(el('div', null, content || '(Không tìm thấy nội dung đoạn này trong transcript_chunks.json đã tải.)'));
    pop.classList.remove('hidden');
    const rect = ev.target.getBoundingClientRect();
    const top = Math.min(rect.bottom + 8, window.innerHeight - 160);
    const left = Math.min(rect.left, window.innerWidth - 336);
    pop.style.top = top + 'px';
    pop.style.left = Math.max(8, left) + 'px';
  }
  function hideCitationPopover() { $('citationPopover').classList.add('hidden'); }

  // ---------------- History (localStorage) ----------------
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.history) || '[]'); } catch (e) { return []; }
  }
  function saveHistoryEntry(entry) {
    const list = getHistory();
    list.unshift({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), ts: Date.now(), ...entry });
    localStorage.setItem(LS_KEYS.history, JSON.stringify(list.slice(0, 50)));
    renderHistoryList();
  }
  function deleteHistoryEntry(id) {
    const list = getHistory().filter(x => x.id !== id);
    localStorage.setItem(LS_KEYS.history, JSON.stringify(list));
    renderHistoryList();
  }
  function clearHistoryForGroup() {
    const list = getHistory().filter(x => x.key !== currentKey);
    localStorage.setItem(LS_KEYS.history, JSON.stringify(list));
    renderHistoryList();
  }

  function renderHistoryList() {
    const all = getHistory();
    const mine = all.filter(x => x.key === currentKey);
    $('historyCount').textContent = String(mine.length);

    const listEl = $('historyList');
    listEl.innerHTML = '';
    if (!mine.length) {
      listEl.appendChild(el('div', 'empty-hint', 'Chưa có bản ôn tập nào được lưu cho nhóm này trong trình duyệt này.'));
      return;
    }
    const clearBtn = el('button', 'secondary', '🗑️ Xóa lịch sử nhóm này');
    clearBtn.style.marginBottom = '10px';
    clearBtn.addEventListener('click', clearHistoryForGroup);
    listEl.appendChild(clearBtn);

    mine.forEach(entry => {
      const item = el('div', 'history-item');
      const top = el('div', 'hi-top');
      top.appendChild(el('span', null, entry.model || DEFAULT_MODEL));
      top.appendChild(el('span', 'hi-time', new Date(entry.ts).toLocaleString('vi-VN')));
      item.appendChild(top);
      item.appendChild(el('div', 'hi-preview', entry.text.slice(0, 160).replace(/\s+/g, ' ')));
      const actions = el('div', 'hi-actions');
      const viewBtn = el('button', 'secondary', 'Xem lại');
      viewBtn.addEventListener('click', () => {
        setReviewRich(entry.text);
        document.querySelector('.tab[data-tab="review"]').click();
      });
      const delBtn = el('button', 'secondary', 'Xóa');
      delBtn.addEventListener('click', () => deleteHistoryEntry(entry.id));
      actions.appendChild(viewBtn);
      actions.appendChild(delBtn);
      item.appendChild(actions);
      listEl.appendChild(item);
    });
  }

  // ---------------- Copy / download ----------------
  function copyReview() {
    if (!currentReviewText) return;
    navigator.clipboard.writeText(currentReviewText)
      .then(() => toast('Đã copy bản ôn tập vào clipboard.', 'success'))
      .catch(() => toast('Không copy được — trình duyệt chặn clipboard.', 'error'));
  }
  function downloadReview() {
    if (!currentReviewText) return;
    const g = GROUP_META.find(x => x.key === currentKey);
    const name = `on-tap_${g ? g.uid : 'nhom'}_${g ? g.dc : ''}`.replace(/[^\w\-]+/g, '_');
    const blob = new Blob([currentReviewText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name + '.md';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Đã tải bản ôn tập (.md).', 'success');
  }

  // ---------------- Settings modal ----------------
  function openSettings(focusKey) {
    const storedKey = localStorage.getItem(LS_KEYS.apiKey);
    $('apiKeyInput').value = storedKey || (window.OPENROUTER_API_KEY ? window.OPENROUTER_API_KEY : '');
    $('rememberKey').checked = !!storedKey;
    $('modelSelect').value = getEffectiveModel();
    $('settingsModal').classList.remove('hidden');
    if (focusKey) setTimeout(() => $('apiKeyInput').focus(), 50);
  }
  function closeSettings() { $('settingsModal').classList.add('hidden'); }
  function saveSettings() {
    const key = $('apiKeyInput').value.trim();
    const remember = $('rememberKey').checked;
    if (remember && key) {
      localStorage.setItem(LS_KEYS.apiKey, key);
    } else {
      localStorage.removeItem(LS_KEYS.apiKey);
      window.__RUNTIME_KEY = key || window.__RUNTIME_KEY;
    }
    localStorage.setItem(LS_KEYS.model, $('modelSelect').value);
    $('modeIndicator') && ($('modeIndicator').textContent = $('modelSelect').value);
    document.querySelector('.mode-pill').textContent = 'Mock+AI · ' + $('modelSelect').value.split('/').pop();
    closeSettings();
    toast('Đã lưu cài đặt.', 'success');
  }

  // ---------------- Mobile sidebar ----------------
  function initMobileSidebar() {
    const sidebar = $('sidebar');
    const overlay = $('sidebarOverlay');
    $('menuToggle').addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // ---------------- Wire up ----------------
  function init() {
    initTheme();
    initTabs();
    initMobileSidebar();

    $('themeToggle').addEventListener('click', toggleTheme);
    $('groupSearch').addEventListener('input', renderGroupList);
    $('sortSelect').addEventListener('change', renderGroupList);

    document.querySelectorAll('#citeFilter .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#citeFilter .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentTurnFilter = chip.dataset.filter;
        renderTurnList();
      });
    });
    $('turnSearch').addEventListener('input', (e) => { currentTurnSearch = e.target.value; renderTurnList(); });

    $('genBtn').addEventListener('click', generateReview);
    $('copyBtn').addEventListener('click', copyReview);
    $('downloadBtn').addEventListener('click', downloadReview);

    $('settingsBtn').addEventListener('click', () => openSettings(false));
    $('closeSettings').addEventListener('click', closeSettings);
    $('saveSettings').addEventListener('click', saveSettings);
    $('settingsModal').addEventListener('click', (e) => { if (e.target.id === 'settingsModal') closeSettings(); });

    document.addEventListener('click', hideCitationPopover);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSettings(); hideCitationPopover(); } });

    resetReviewPanel();
    loadData();
    loadTranscriptChunks();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
