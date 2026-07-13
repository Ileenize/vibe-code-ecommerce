// ============================================================
// MEETING FIRST GAME — Frontend App Logic (Vanilla JS)
// Connects to Express API backend at http://localhost:5000
// ============================================================

const API = 'http://localhost:5000/api';

// ---- State ----
let currentUser = null;
let allMeetups = [];
let allCafes = [];
let allGames = [];
let activeFilters = { status: '', category: '' };

// ---- Nav scroll effect ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 10) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ============================================================
// PAGE ROUTING
// ============================================================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add('active');

  const navEl = document.getElementById(`nav-${page}`);
  if (navEl) navEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'home') loadHome();
  else if (page === 'meetups') loadMeetupsPage();
  else if (page === 'cafes') loadCafesPage();
  else if (page === 'my-bookings') loadMyBookings();
  else if (page === 'dashboard') loadDashboard();
}

// ============================================================
// HOME
// ============================================================
async function loadHome() {
  try {
    const [meetupsRes, cafesRes, gamesRes] = await Promise.all([
      fetch(`${API}/meetups`),
      fetch(`${API}/cafes`),
      fetch(`${API}/games`)
    ]);
    const meetupsData = await meetupsRes.json();
    const cafesData = await cafesRes.json();
    const gamesData = await gamesRes.json();

    allMeetups = meetupsData.data || [];
    allCafes = cafesData.data || [];
    allGames = gamesData.data || [];

    // Stats
    const recruiting = allMeetups.filter(m => m.status === 'recruiting');
    document.getElementById('stat-meetups').textContent = allMeetups.length;
    document.getElementById('stat-cafes').textContent = allCafes.length;
    document.getElementById('stat-games').textContent = allGames.length;
    document.getElementById('stat-recruiting').textContent = recruiting.length;

    // Featured meetups (recruiting only, up to 6)
    renderMeetupGrid('home-meetup-grid', recruiting.slice(0, 6));
  } catch (err) {
    console.error(err);
    showError('home-meetup-grid', 'ไม่สามารถเชื่อมต่อ API ได้');
  }
}

// ============================================================
// MEETUPS PAGE
// ============================================================
async function loadMeetupsPage() {
  const grid = document.getElementById('meetups-grid');
  grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>กำลังโหลด...</span></div>`;
  try {
    if (!allMeetups.length) {
      const res = await fetch(`${API}/meetups`);
      const data = await res.json();
      allMeetups = data.data || [];
    }
    applyMeetupFilters();

    // Show "Create Meetup" button if logged in as player
    const btn = document.getElementById('btn-create-meetup');
    if (currentUser && currentUser.role === 'player') btn.style.display = 'flex';
    else btn.style.display = 'none';
  } catch (err) {
    showError('meetups-grid', 'ไม่สามารถโหลดข้อมูลตี้ได้');
  }
}

function applyMeetupFilters() {
  let filtered = [...allMeetups];
  if (activeFilters.status) filtered = filtered.filter(m => m.status === activeFilters.status);
  if (activeFilters.category) filtered = filtered.filter(m => m.game_id && m.game_id.category === activeFilters.category);
  renderMeetupGrid('meetups-grid', filtered);
}

function filterMeetups(btn, type) {
  const parent = document.getElementById(`filter-${type}`);
  parent.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  activeFilters[type] = btn.dataset.val;
  applyMeetupFilters();
}

// ============================================================
// RENDER MEETUP GRID
// ============================================================
function renderMeetupGrid(containerId, meetups) {
  const container = document.getElementById(containerId);
  if (!meetups || meetups.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎲</div>
        <div class="empty-title">ยังไม่มีตี้ในขณะนี้</div>
        <div class="empty-sub">ลองเปลี่ยนตัวกรอง หรือสร้างตี้แรกของคุณเอง!</div>
      </div>`;
    return;
  }
  container.innerHTML = meetups.map(m => meetupCardHtml(m)).join('');
}

function getCategoryEmoji(cat) {
  const map = { strategy: '🏆', party: '🎉', coop: '🤝' };
  return map[cat] || '🎲';
}

function meetupCardHtml(m) {
  const game = m.game_id;
  const cafe = m.cafe_id;
  const pct = Math.round((m.current_players / m.max_players) * 100);
  const dateStr = m.date ? new Date(m.date).toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';
  const catClass = game ? `cat-${game.category}` : 'cat-open';
  const catLabel = game ? game.category : 'open';
  const emoji = game ? getCategoryEmoji(game.category) : '🎲';

  return `<div class="meetup-card" id="mcard-${m._id}" onclick="openMeetupModal('${m._id}')">
    <div class="mc-header">
      <div class="mc-emoji">${emoji}</div>
      <div class="mc-meta">
        <div class="mc-title">${escHtml(m.title)}</div>
        <div class="mc-cafe">📍 ${cafe ? escHtml(cafe.name) : '—'}</div>
      </div>
    </div>
    <div class="mc-body">
      <span class="mc-info"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${dateStr}</span>
      <span class="mc-info"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${m.start_time}–${m.end_time}</span>
      <span class="cat-badge ${catClass}">${catLabel}</span>
    </div>
    <div class="mc-footer">
      <div class="mc-players">
        <div class="players-text">${m.current_players}/${m.max_players} คน</div>
        <div class="players-bar"><div class="players-fill" style="width:${pct}%"></div></div>
      </div>
      <span class="status-badge status-${m.status}">${statusLabel(m.status)}</span>
    </div>
  </div>`;
}

function statusLabel(s) {
  const map = { recruiting: '🟢 กำลังรับ', confirmed: '🔵 ยืนยัน', completed: '✅ เสร็จ', cancelled: '❌ ยกเลิก' };
  return map[s] || s;
}

// ============================================================
// MEETUP DETAIL MODAL
// ============================================================
async function openMeetupModal(id) {
  openModal('modal-meetup');
  const content = document.getElementById('meetup-modal-content');
  content.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API}/meetups/${id}`);
    const data = await res.json();
    const m = data.data;
    const game = m.game_id;
    const cafe = m.cafe_id;
    const dateStr = m.date ? new Date(m.date).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—';
    const pct = Math.round((m.current_players / m.max_players) * 100);
    const emoji = game ? getCategoryEmoji(game.category) : '🎲';
    const spotsLeft = m.max_players - m.current_players;
    const canJoin = currentUser && currentUser.role === 'player' && m.status === 'recruiting' && spotsLeft > 0;

    document.getElementById('meetup-modal-title').textContent = m.title;
    content.innerHTML = `
      <div class="meetup-detail">
        <div class="md-game-hero">
          <div class="md-emoji">${emoji}</div>
          <div class="md-game-info">
            <h3>${game ? escHtml(game.title) : 'Open — เลือกเกมที่ร้าน'}</h3>
            <p>${game ? `${game.category} · ${game.complexity} · ${game.min_players}–${game.max_players} คน · ${game.duration_minutes} นาที` : 'ยังไม่ระบุเกม พนักงานจะช่วยแนะนำ'}</p>
          </div>
        </div>

        <div class="md-info-grid">
          <div class="md-info-item">
            <div class="md-info-label">คาเฟ่</div>
            <div class="md-info-value">${cafe ? escHtml(cafe.name) : '—'}</div>
          </div>
          <div class="md-info-item">
            <div class="md-info-label">สถานที่</div>
            <div class="md-info-value" style="font-size:0.8rem">${cafe ? escHtml(cafe.address) : '—'}</div>
          </div>
          <div class="md-info-item">
            <div class="md-info-label">วันที่</div>
            <div class="md-info-value">${dateStr}</div>
          </div>
          <div class="md-info-item">
            <div class="md-info-label">เวลา</div>
            <div class="md-info-value">${m.start_time} – ${m.end_time}</div>
          </div>
          <div class="md-info-item">
            <div class="md-info-label">ผู้จัด</div>
            <div class="md-info-value">${m.host_id ? escHtml(m.host_id.username) : '—'}</div>
          </div>
          <div class="md-info-item">
            <div class="md-info-label">สถานะ</div>
            <div class="md-info-value"><span class="status-badge status-${m.status}">${statusLabel(m.status)}</span></div>
          </div>
        </div>

        <div class="md-players-info">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem">
            <span style="color:var(--c-text-2)">ผู้เข้าร่วม</span>
            <span style="font-weight:700">${m.current_players} / ${m.max_players} คน <span style="color:var(--c-text-3);font-weight:400">(ขั้นต่ำ ${m.min_players})</span></span>
          </div>
          <div class="players-bar" style="height:8px">
            <div class="players-fill" style="width:${pct}%"></div>
          </div>
          ${spotsLeft > 0 ? `<p style="margin-top:8px;font-size:0.8rem;color:var(--c-green)">🟢 ยังว่างอีก ${spotsLeft} ที่</p>` : `<p style="margin-top:8px;font-size:0.8rem;color:var(--c-amber)">🔴 เต็มแล้ว</p>`}
        </div>

        ${m.description ? `<div class="md-desc">${escHtml(m.description)}</div>` : ''}

        <div class="md-actions">
          <button class="btn btn-outline" onclick="closeModal('modal-meetup')">ปิด</button>
          ${canJoin
            ? `<button class="btn btn-primary" id="btn-join-meetup" onclick="joinMeetup('${m._id}')">🎟️ เข้าร่วม + จ่ายมัดจำ ฿150</button>`
            : !currentUser
              ? `<button class="btn btn-outline" onclick="closeModal('modal-meetup');openLoginModal()">เข้าสู่ระบบเพื่อเข้าร่วม</button>`
              : `<button class="btn btn-outline" disabled style="opacity:0.5;cursor:not-allowed">${m.status !== 'recruiting' ? 'ตี้นี้ปิดแล้ว' : 'เต็มแล้ว'}</button>`
          }
        </div>
      </div>`;
  } catch (err) {
    content.innerHTML = `<div class="loading-state" style="color:var(--c-red)">เกิดข้อผิดพลาด</div>`;
  }
}

// ============================================================
// JOIN MEETUP
// ============================================================
async function joinMeetup(meetupId) {
  const btn = document.getElementById('btn-join-meetup');
  btn.disabled = true;
  btn.textContent = 'กำลังดำเนินการ...';

  try {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetup_id: meetupId, player_id: currentUser._id, username: currentUser.username })
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');

    showToast(`✅ เข้าร่วมตี้สำเร็จ! Booking Code: ${data.data.booking.booking_code}`, 'success');
    closeModal('modal-meetup');

    // Refresh meetups data
    const newRes = await fetch(`${API}/meetups`);
    const newData = await newRes.json();
    allMeetups = newData.data || [];
    applyMeetupFilters();
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
    btn.disabled = false;
    btn.textContent = '🎟️ เข้าร่วม + จ่ายมัดจำ ฿150';
  }
}

// ============================================================
// CREATE MEETUP MODAL
// ============================================================
async function openCreateMeetupModal() {
  if (!currentUser) return openLoginModal();

  // Load cafes & games into selects
  if (!allCafes.length) {
    const res = await fetch(`${API}/cafes`);
    const data = await res.json();
    allCafes = data.data || [];
  }
  if (!allGames.length) {
    const res = await fetch(`${API}/games`);
    const data = await res.json();
    allGames = data.data || [];
  }

  const cafeSelect = document.getElementById('cm-cafe');
  cafeSelect.innerHTML = allCafes.map(c => `<option value="${c._id}">${escHtml(c.name)}</option>`).join('');

  const gameSelect = document.getElementById('cm-game');
  gameSelect.innerHTML = allGames.map(g => `<option value="${g._id}">${escHtml(g.title)}</option>`).join('');

  // Set min date to today
  document.getElementById('cm-date').min = new Date().toISOString().split('T')[0];

  openModal('modal-create-meetup');
}

function toggleGameSelect() {
  const type = document.getElementById('cm-type').value;
  document.getElementById('cm-game-group').style.display = type === 'specific' ? 'flex' : 'none';
}

async function submitCreateMeetup(e) {
  e.preventDefault();
  const btn = document.getElementById('create-meetup-submit');
  btn.disabled = true;
  btn.textContent = 'กำลังสร้าง...';

  const type = document.getElementById('cm-type').value;
  const body = {
    host_id: currentUser._id,
    cafe_id: document.getElementById('cm-cafe').value,
    game_id: type === 'specific' ? document.getElementById('cm-game').value : null,
    title: document.getElementById('cm-title').value,
    description: document.getElementById('cm-description').value,
    type,
    date: document.getElementById('cm-date').value,
    start_time: document.getElementById('cm-start').value,
    end_time: document.getElementById('cm-end').value,
    min_players: parseInt(document.getElementById('cm-min').value),
    max_players: parseInt(document.getElementById('cm-max').value),
    current_players: 1,
    status: 'recruiting'
  };

  try {
    const res = await fetch(`${API}/meetups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');

    showToast('🎉 สร้างตี้สำเร็จแล้ว!', 'success');
    closeModal('modal-create-meetup');
    document.getElementById('create-meetup-form').reset();

    // Reload
    const newRes = await fetch(`${API}/meetups`);
    const newData = await newRes.json();
    allMeetups = newData.data || [];
    applyMeetupFilters();
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'สร้างตี้';
  }
}

// ============================================================
// CAFES PAGE
// ============================================================
async function loadCafesPage() {
  const grid = document.getElementById('cafes-grid');
  grid.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;
  try {
    if (!allCafes.length) {
      const res = await fetch(`${API}/cafes`);
      const data = await res.json();
      allCafes = data.data || [];
    }

    if (!allCafes.length) {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🏠</div><div class="empty-title">ยังไม่มีคาเฟ่</div></div>`;
      return;
    }

    grid.innerHTML = allCafes.map(c => cafeCardHtml(c)).join('');
  } catch (err) {
    showError('cafes-grid', 'ไม่สามารถโหลดข้อมูลคาเฟ่ได้');
  }
}

function cafeCardHtml(c) {
  return `<div class="cafe-card" id="cafe-${c._id}" onclick="openCafeModal('${c._id}')">
    <div class="cafe-banner">🏠</div>
    <div class="cafe-body">
      <div class="cafe-name">${escHtml(c.name)}</div>
      <div class="cafe-address">📍 ${escHtml(c.address)}</div>
      <div class="cafe-hours">
        ${(c.operating_hours || []).map(h => `<div class="cafe-hour-item"><span>🕐</span><span>${escHtml(h)}</span></div>`).join('')}
      </div>
      <div class="cafe-footer">
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openCafeModal('${c._id}')">ดูรายละเอียด →</button>
      </div>
    </div>
  </div>`;
}

async function openCafeModal(id) {
  openModal('modal-cafe');
  const content = document.getElementById('cafe-modal-content');
  content.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API}/cafes/${id}`);
    const data = await res.json();
    const c = data.data;
    document.getElementById('cafe-modal-title').textContent = c.name;

    const tablesHtml = (c.tables || []).map(t => `
      <div class="table-chip ${t.status}">
        <div class="table-num">${escHtml(t.table_number)}</div>
        <div class="table-cap">${t.capacity} ที่นั่ง</div>
        <div style="font-size:0.7rem;margin-top:2px;color:var(--c-text-3)">${tableStatusLabel(t.status)}</div>
      </div>`).join('');

    const gamesHtml = (c.games || []).map(g => `<span class="game-chip cat-badge cat-${g.category || ''}">${escHtml(g.title)}</span>`).join('');

    content.innerHTML = `<div class="cafe-detail">
      <div class="cafe-detail-section">
        <div class="cafe-detail-section-title">ข้อมูลร้าน</div>
        <p style="font-size:0.88rem;color:var(--c-text-2);line-height:1.8">📍 ${escHtml(c.address)}</p>
        <p style="font-size:0.88rem;color:var(--c-text-2);margin-top:6px">📞 ${escHtml(c.phone || '—')}</p>
      </div>
      <div class="cafe-detail-section">
        <div class="cafe-detail-section-title">เวลาเปิด–ปิด</div>
        ${(c.operating_hours || []).map(h => `<p style="font-size:0.85rem;color:var(--c-text-2);margin-bottom:4px">🕐 ${escHtml(h)}</p>`).join('')}
      </div>
      ${c.tables && c.tables.length ? `<div class="cafe-detail-section">
        <div class="cafe-detail-section-title">โต๊ะทั้งหมด</div>
        <div class="tables-grid">${tablesHtml}</div>
      </div>` : ''}
      ${c.games && c.games.length ? `<div class="cafe-detail-section">
        <div class="cafe-detail-section-title">บอร์ดเกมในร้าน</div>
        <div class="games-chips">${gamesHtml}</div>
      </div>` : ''}
      <div style="padding-bottom:8px;display:flex;justify-content:flex-end">
        <button class="btn btn-primary" onclick="closeModal('modal-cafe');showPage('meetups')">ดูตี้ในร้านนี้ →</button>
      </div>
    </div>`;
  } catch (err) {
    content.innerHTML = `<div class="loading-state" style="color:var(--c-red)">เกิดข้อผิดพลาด</div>`;
  }
}

function tableStatusLabel(s) {
  const map = { available: 'ว่าง', occupied: 'ใช้งานอยู่', out_of_service: 'ปิดซ่อม' };
  return map[s] || s;
}

// ============================================================
// MY BOOKINGS
// ============================================================
async function loadMyBookings() {
  if (!currentUser) {
    document.getElementById('bookings-list').innerHTML = `<div class="empty-state"><div class="empty-icon">🔐</div><div class="empty-title">กรุณาเข้าสู่ระบบก่อน</div><div class="empty-sub"><button class="btn btn-primary" onclick="openLoginModal()">เข้าสู่ระบบ</button></div></div>`;
    return;
  }
  const list = document.getElementById('bookings-list');
  list.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API}/bookings?player_id=${currentUser._id}`);
    const data = await res.json();
    const bookings = data.data || [];

    if (!bookings.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">🎟️</div><div class="empty-title">ยังไม่มีการจอง</div><div class="empty-sub">ไปดูตี้ที่กำลังรับสมาชิกได้เลย!</div><br/><button class="btn btn-primary" onclick="showPage('meetups')">ดูตี้ทั้งหมด</button></div>`;
      return;
    }

    list.innerHTML = bookings.map(b => {
      const m = b.meetup_id;
      const dateStr = m && m.date ? new Date(m.date).toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';
      const cafe = m && m.cafe_id ? m.cafe_id.name : '—';
      const game = m && m.game_id ? m.game_id.title : 'Open';
      const emoji = m && m.game_id ? getCategoryEmoji(m.game_id.category) : '🎲';
      return `<div class="booking-card">
        <div class="bc-icon">${emoji}</div>
        <div class="bc-body">
          <div class="bc-title">${m ? escHtml(m.title) : 'ตี้ไม่พบ'}</div>
          <div class="bc-meta">
            <span>📍 ${escHtml(cafe)}</span>
            <span>🎮 ${escHtml(game)}</span>
            <span>📅 ${dateStr}</span>
            ${m ? `<span>🕐 ${m.start_time}–${m.end_time}</span>` : ''}
          </div>
          <div class="bc-code">${escHtml(b.booking_code)}</div>
        </div>
        <div class="bc-right">
          <span class="status-badge status-${b.status}">${statusLabel(b.status)}</span>
        </div>
      </div>`;
    }).join('');
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">เกิดข้อผิดพลาด</div></div>`;
  }
}

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard() {
  if (!currentUser || !currentUser.cafe_id) {
    document.getElementById('dashboard-meetups').innerHTML = `<div class="empty-state"><div class="empty-icon">🔐</div><div class="empty-title">ต้องเข้าสู่ระบบในฐานะ Staff หรือ Owner เพื่อดูแดชบอร์ด</div></div>`;
    return;
  }
  const meetupsEl = document.getElementById('dashboard-meetups');
  meetupsEl.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API}/dashboard/${currentUser.cafe_id}`);
    const data = await res.json();
    const items = data.data || [];
    const cafe = data.cafe;

    document.getElementById('dashboard-cafe-name').textContent = cafe ? cafe.name : '';

    // Stats
    const totalBookings = items.reduce((a, m) => a + m.bookings.length, 0);
    const confirmed = items.reduce((a, m) => a + m.bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length, 0);
    const statsEl = document.getElementById('dashboard-stats');
    statsEl.innerHTML = [
      { label: 'ตี้ทั้งหมด', val: items.length },
      { label: 'ตี้กำลังรับ', val: items.filter(m => m.status === 'recruiting').length },
      { label: 'การจองทั้งหมด', val: totalBookings },
      { label: 'ยืนยันแล้ว', val: confirmed }
    ].map(s => `<div class="dash-stat-card"><div class="dash-stat-num">${s.val}</div><div class="dash-stat-label">${s.label}</div></div>`).join('');

    if (!items.length) {
      meetupsEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">ยังไม่มีตี้ในร้านของคุณ</div></div>`;
      return;
    }

    meetupsEl.innerHTML = `<div class="dash-section-title">ตี้ทั้งหมดในร้าน</div>` + items.map((m, i) => {
      const dateStr = m.date ? new Date(m.date).toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';
      const bookingsHtml = m.bookings.length
        ? m.bookings.map(b => `<div class="booking-row">
            <span class="br-name">👤 ${b.player_id ? escHtml(b.player_id.username) : '—'}</span>
            <span class="br-code">${escHtml(b.booking_code)}</span>
            <span class="status-badge status-${b.status}" style="font-size:0.7rem">${statusLabel(b.status)}</span>
          </div>`).join('')
        : '<p style="color:var(--c-text-3);font-size:0.85rem;padding-top:10px">ยังไม่มีการจอง</p>';

      return `<div class="dash-meetup-item">
        <div class="dash-meetup-header" onclick="toggleDashItem(${i})">
          <div class="dash-mi-info">
            <div class="dash-mi-title">${escHtml(m.title)}</div>
            <div class="dash-mi-sub">${dateStr} · ${m.start_time}–${m.end_time} · ${m.bookings.length} การจอง</div>
          </div>
          <span class="status-badge status-${m.status}">${statusLabel(m.status)}</span>
          <span class="dash-mi-toggle" id="toggle-${i}">▾</span>
        </div>
        <div class="dash-meetup-body" id="dash-body-${i}">
          <p style="font-size:0.8rem;color:var(--c-text-3);padding-top:12px;margin-bottom:4px">รายชื่อผู้จอง</p>
          ${bookingsHtml}
        </div>
      </div>`;
    }).join('');
  } catch (err) {
    meetupsEl.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">เกิดข้อผิดพลาด</div></div>`;
  }
}

function toggleDashItem(i) {
  const body = document.getElementById(`dash-body-${i}`);
  const toggle = document.getElementById(`toggle-${i}`);
  const isOpen = body.classList.toggle('open');
  toggle.textContent = isOpen ? '▴' : '▾';
}

// ============================================================
// AUTH (DEMO: just pick a user)
// ============================================================
async function openLoginModal() {
  const listEl = document.getElementById('user-select-list');
  listEl.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;
  openModal('modal-login');

  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    const users = data.data || [];

    const roleEmoji = { player: '🎮', staff: '🏪', owner_cafe: '👑' };

    listEl.innerHTML = users.map(u => `
      <div class="user-row" id="user-row-${u._id}" onclick="loginAs('${u._id}', '${escHtml(u.username)}', '${u.role}', ${u.cafe_id ? `'${u.cafe_id}'` : null})">
        <div class="ur-avatar">${roleEmoji[u.role] || '👤'}</div>
        <div class="ur-name">${escHtml(u.username)}</div>
        <span class="ur-role role-${u.role}">${u.role}</span>
      </div>`).join('');
  } catch (err) {
    listEl.innerHTML = `<p style="padding:16px;color:var(--c-red)">ไม่สามารถโหลดผู้ใช้ได้</p>`;
  }
}

function loginAs(id, username, role, cafeId) {
  currentUser = { _id: id, username, role, cafe_id: cafeId };
  closeModal('modal-login');

  // Update UI
  document.getElementById('user-area-logged-out').style.display = 'none';
  document.getElementById('user-area-logged-in').style.display = 'flex';
  document.getElementById('user-badge-text').textContent = `${username} (${role})`;

  // Show/hide nav items
  document.getElementById('nav-my-bookings').style.display = role === 'player' ? 'block' : 'none';
  document.getElementById('nav-dashboard').style.display = (role === 'staff' || role === 'owner_cafe') ? 'block' : 'none';

  showToast(`👋 ยินดีต้อนรับ ${username}!`, 'success');
}

function logout() {
  currentUser = null;
  document.getElementById('user-area-logged-out').style.display = 'flex';
  document.getElementById('user-area-logged-in').style.display = 'none';
  document.getElementById('nav-my-bookings').style.display = 'none';
  document.getElementById('nav-dashboard').style.display = 'none';
  document.getElementById('btn-create-meetup').style.display = 'none';
  showToast('ออกจากระบบแล้ว', 'info');
  showPage('home');
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOnOverlay(e, id) {
  if (e.target.id === id) closeModal(id);
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3500);
}

// ============================================================
// UTILS
// ============================================================
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showError(containerId, msg) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">${msg}</div><div class="empty-sub">ตรวจสอบว่า Backend Server รันอยู่ที่ port 5000</div></div>`;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
});
