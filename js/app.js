'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const {titles} = MarvelData;
  const ids = new Set(titles.map(t => t.id));
  const loaded = MarvelStorage.load(ids);
  let state = loaded.state;
  let view = 'all';
  let activeTitle = null;
  let nextTitle = null;
  let toastTimer;
  let confirmation = null;
  const collapsed = new Set();
  const universes = ['MCU', 'X-Men', 'Spider-Man', 'Fantastic Four', 'Sony', 'Defenders', 'Other Marvel'];
  const releaseLabels = {released: 'Released', upcoming: 'Upcoming', unconfirmed: 'Release date unconfirmed'};
  const statusLabels = {'not-started': 'Not started', watching: 'Watching', completed: 'Completed', skipped: 'Skipped'};
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const button = (text, className, action, label) => { const node = el('button', className, text); node.type = 'button'; if (label) node.setAttribute('aria-label', label); node.addEventListener('click', action); return node; };
  function notify(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5000); }
  function persist(deliberate = false) { const error = MarvelStorage.save(state, ids, deliberate); $('storage-status').textContent = error || 'Your progress is saved in this browser.'; document.querySelector('.local-pill').textContent = error ? '● Session only • export a backup' : '● Saved on this device'; if (error) notify(error); }
  function change(id, patch) { state.records[id] = {...MarvelCore.record(state, id), ...patch}; persist(); render(); }
  function ask(message, action, label = 'Confirm') { $('confirm-message').textContent = message; $('confirm-accept').textContent = label; confirmation = action; $('confirm-dialog').showModal(); $('confirm-cancel').focus(); }
  function filters() { const result = {}; for (const name of ['type', 'universe', 'category', 'phase', 'character', 'year', 'status', 'release', 'importance']) result[name] = $('filter-' + name).value; return {...result, search: $('search').value, hideCompleted: state.preferences.hideCompleted, essential: view === 'essentials' || state.preferences.mode === 'essentials', favorites: view === 'favorites', upcoming: view === 'upcoming', planner: view === 'planner'}; }
  function orderedTitles() { let list = titles.filter(t => (!filters().universe || t.universes.includes(filters().universe)) && (state.preferences.mode !== 'essentials' || t.essential)); list = MarvelCore.sort(list, state, state.preferences.mode === 'essentials' ? 'recommended' : 'release'); if (state.preferences.mode === 'universe') list.sort((a, b) => universes.indexOf(a.universes[0]) - universes.indexOf(b.universes[0])); return list; }
  function renderStats() {
    const stats = MarvelCore.stats(titles, state);
    $('overall-percent').textContent = stats.percent + '%'; $('overall-progress').value = stats.percent;
    $('total-count').textContent = stats.total; $('nav-total').textContent = stats.total; $('completed-count').textContent = stats.completed; $('remaining-count').textContent = stats.remaining + ' left to discover'; $('watching-count').textContent = stats.watching;
    const essential = MarvelCore.stats(titles.filter(t => t.essential), state);
    $('essential-progress').value = essential.percent; $('essential-caption').textContent = `${essential.completed} of ${essential.total} essentials completed · ${essential.percent}% ready`;
    nextTitle = MarvelCore.next(orderedTitles(), state);
    $('next-title').textContent = nextTitle ? nextTitle.title : 'You’re all caught up.';
    $('next-meta').textContent = nextTitle ? `${nextTitle.year || 'Year unconfirmed'} · ${nextTitle.universes.join(' / ')} · ${statusLabels[MarvelCore.record(state, nextTitle.id).status]}` : 'No released, unskipped titles remain in this watch order.';
    $('next-open').disabled = !nextTitle; $('resume').disabled = !nextTitle;
  }
  function poster(title) {
    const art = el('div', 'poster-art universe-' + universes.indexOf(title.universes[0]));
    art.append(el('span', 'poster-universe', title.universes[0]), el('span', 'poster-monogram', title.title.replace(/^(The |Marvel's )/, '').split(/[ :—-]/).filter(Boolean).slice(0, 2).map(s => s[0]).join('')), el('span', 'poster-fallback-title', title.series || title.title));
    const source = MarvelSecurity.imageURL(title.poster);
    if (source) { const img = document.createElement('img'); img.src = source; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.addEventListener('error', () => img.remove()); art.append(img); }
    return art;
  }
  function card(title) {
    const r = MarvelCore.record(state, title.id);
    const card = el('article', 'title-card' + (r.status === 'completed' ? ' is-complete' : '')); card.dataset.id = title.id;
    const art = poster(title); const open = button('', 'poster-open', () => openDetail(title), 'View details for ' + title.title); art.append(open);
    const favorite = button(r.favorite ? '♥' : '♡', 'favorite-button' + (r.favorite ? ' favorited' : ''), () => change(title.id, {favorite: !r.favorite}), 'Favorite ' + title.title); favorite.setAttribute('aria-pressed', String(r.favorite)); art.append(favorite);
    if (title.essential) art.append(el('span', 'essential-badge', '✦ ESSENTIAL'));
    if (title.release !== 'released') art.append(el('span', 'release-badge', releaseLabels[title.release]));
    const body = el('div', 'card-body');
    body.append(el('span', 'card-meta', `${title.year || 'TBA'}  ·  ${title.type === 'movie' ? 'MOVIE' : 'TV · SEASON ' + (title.season || '—')}`));
    body.append(button(title.title, 'card-title', () => openDetail(title)));
    const tags = el('div', 'tags'); tags.append(el('span', 'tag', title.universes[0])); if (title.phase) tags.append(el('span', 'tag', 'Phase ' + title.phase)); else tags.append(el('span', 'tag', title.type === 'tv' ? 'Series' : 'Feature')); body.append(tags);
    const control = el('div', 'card-controls');
    const checkLabel = el('label', 'complete-control'); const check = document.createElement('input'); check.type = 'checkbox'; check.checked = r.status === 'completed'; check.setAttribute('aria-label', 'Mark ' + title.title + ' completed'); check.addEventListener('change', () => change(title.id, {status: check.checked ? 'completed' : 'not-started'})); checkLabel.append(check, el('span', '', r.status === 'completed' ? 'Completed' : 'Mark completed'));
    control.append(checkLabel, button(state.planner.includes(title.id) ? '✓' : '+', 'plan-button', () => togglePlan(title), (state.planner.includes(title.id) ? 'Remove ' : 'Add ') + title.title + ' to session planner')); body.append(control); card.append(art, body); return card;
  }
  function groupKey(t) {
    if (t.release !== 'released' || t.categories.includes('upcoming')) return 'Upcoming / Release watch';
    if (state.preferences.mode === 'universe') return t.universes[0] + (t.phase ? ' · Phase ' + t.phase : t.type === 'tv' ? ' · Television' : ' · Movies');
    if (state.preferences.mode === 'essentials') return 'Your Doomsday essentials';
    if ($('sort').value !== 'release') return 'All matching titles';
    return t.year ? String(t.year) : 'Release date unconfirmed';
  }
  function groupRank(key) { const index = universes.findIndex(u => key.startsWith(u)); const phase = key.match(/Phase (\d)/); return index < 0 ? 999 : index * 100 + (phase ? Number(phase[1]) : 20); }
  function renderLibrary() {
    const selected = MarvelCore.filter(titles, state, filters());
    const results = MarvelCore.sort(selected, state, state.preferences.mode === 'essentials' ? 'recommended' : $('sort').value);
    const labels = {all: 'Your watchlist', essentials: 'Doomsday essentials', upcoming: 'Upcoming & release watch', favorites: 'Your favorites', planner: 'Your session planner'};
    $('library-heading').firstChild.textContent = labels[view] + ' '; $('result-count').textContent = results.length + ' titles';
    const notes = {essentials: 'A fan-curated recommendation, not an official requirement. Older Spider-Man movies and Daredevil: Born Again are optional additions in the full library.', upcoming: 'Unverified seasons stay unconfirmed. Requested release-watch titles stay here for reference even after a verified release. Dates are never used to auto-complete titles.', planner: `Your marathon has ${state.planner.length} selected titles. Use + on any card to add a title; remove it here with ✓. Your choices are saved.`};
    $('view-note').textContent = notes[view] || (state.preferences.mode === 'essentials' ? notes.essentials : ''); $('view-note').hidden = !$('view-note').textContent;
    $('library-content').replaceChildren();
    if (!results.length) { const empty = el('div', 'empty-state'); empty.append(el('span', 'empty-icon', '✦'), el('h3', '', view === 'planner' ? 'Build your next movie night.' : 'A universe of possibilities. No matches yet.'), el('p', '', view === 'favorites' ? 'Tap the heart on a title to keep it here.' : view === 'planner' ? 'Add titles with the + button on each card.' : 'Try another search or clear your filters to explore again.'), button('Explore the full library', 'outline-button', clearFilters)); $('library-content').append(empty); return; }
    const groups = new Map();
    for (const title of results) { const key = groupKey(title); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(title); }
    if (state.preferences.mode === 'universe') { const entries = [...groups.entries()].sort((a, b) => groupRank(a[0]) - groupRank(b[0])); groups.clear(); for (const [key, value] of entries) groups.set(key, value); }
    for (const [key, group] of groups) {
      const section = el('details', 'library-group'); section.open = !collapsed.has(key); section.addEventListener('toggle', () => section.open ? collapsed.delete(key) : collapsed.add(key));
      const summary = el('summary'); const done = MarvelCore.stats(group, state); summary.append(el('span', 'group-name', key), el('span', 'group-count', `${group.length} titles`), el('span', 'group-progress', `${done.completed} / ${done.total} completed`)); section.append(summary);
      const grid = el('div', 'card-grid'); for (const title of group) grid.append(card(title)); section.append(grid); $('library-content').append(section);
    }
  }
  function render() { document.documentElement.dataset.theme = state.preferences.theme; document.documentElement.dataset.density = state.preferences.density; $('theme-toggle').textContent = state.preferences.theme === 'dark' ? '☀' : '☾'; $('theme-toggle').setAttribute('aria-label', 'Switch to ' + (state.preferences.theme === 'dark' ? 'light' : 'dark') + ' theme'); $('density-toggle').setAttribute('aria-pressed', String(state.preferences.density === 'compact')); $('density-toggle').setAttribute('aria-label', 'Use ' + (state.preferences.density === 'compact' ? 'comfortable' : 'compact') + ' cards'); $('hide-completed').checked = state.preferences.hideCompleted; document.querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('selected', b.dataset.mode === state.preferences.mode); b.setAttribute('aria-pressed', String(b.dataset.mode === state.preferences.mode)); }); document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view)); renderStats(); renderLibrary(); }
  function togglePlan(title) { if (state.planner.includes(title.id)) state.planner = state.planner.filter(id => id !== title.id); else state.planner.push(title.id); persist(); render(); if ($('detail-dialog').open) renderDetail(title); }
  function renderDetail(title) {
    activeTitle = title;
    const r = MarvelCore.record(state, title.id); const content = $('detail-content'); content.replaceChildren();
    content.append(el('span', 'section-kicker', `${title.universes.join(' / ')} · ${releaseLabels[title.release]}`)); const heading = el('h2', '', title.title); heading.id = 'detail-heading'; content.append(heading, el('p', 'detail-synopsis', title.synopsis || 'Synopsis is not available in this archive.'), el('h3', '', 'Continuity'), el('p', 'muted', title.continuity || 'This title has its own continuity; inclusion does not imply a shared MCU timeline.'));
    const fieldGrid = el('div', 'detail-fields'); const statusLabel = el('label', '', 'Your status'); const status = el('select'); status.setAttribute('aria-label', 'Your status'); for (const [value, label] of Object.entries(statusLabels)) { const opt = el('option', '', label); opt.value = value; status.append(opt); } status.value = r.status; status.addEventListener('change', () => { change(title.id, {status: status.value}); }); statusLabel.append(status);
    const ratingLabel = el('label', '', 'Your rating'); const rating = el('select'); rating.setAttribute('aria-label', 'Your rating'); for (let i = 0; i <= 10; i++) { const opt = el('option', '', i ? i + ' / 10' : 'Not rated'); opt.value = String(i); rating.append(opt); } rating.value = String(r.rating); rating.addEventListener('change', () => change(title.id, {rating: Number(rating.value)})); ratingLabel.append(rating); fieldGrid.append(statusLabel, ratingLabel); content.append(fieldGrid);
    const notesLabel = el('label', 'notes-label', 'Personal notes'); const notes = el('textarea'); notes.rows = 4; notes.maxLength = 2000; notes.value = r.notes; notes.placeholder = 'A theory, a favorite scene, a reason to rewatch…'; notes.setAttribute('aria-label', 'Personal notes'); notes.addEventListener('input', () => { state.records[title.id] = {...MarvelCore.record(state, title.id), notes: notes.value}; persist(); }); notesLabel.append(notes); content.append(notesLabel);
    const actions = el('div', 'settings-actions'); actions.append(button(title.type === 'tv' && title.season ? 'Mark entire season completed' : 'Mark completed', 'primary-button', () => { change(title.id, {status: 'completed'}); renderDetail(title); }), button(state.planner.includes(title.id) ? 'Remove from session' : '+ Add to session', 'outline-button', () => togglePlan(title))); content.append(actions);
    if (title.series) { const siblings = titles.filter(t => t.series === title.series); const seasons = el('details', 'season-list'); seasons.open = true; seasons.append(el('summary', '', 'Seasons & series progress')); for (const sibling of siblings) seasons.append(button(`${sibling.season ? 'Season ' + sibling.season : sibling.title} · ${statusLabels[MarvelCore.record(state, sibling.id).status]} · ${releaseLabels[sibling.release]}`, 'season-button', () => renderDetail(sibling))); content.append(seasons); }
    const related = (title.related || []).map(id => titles.find(t => t.id === id)).filter(Boolean);
    if (related.length) { content.append(el('h3', '', 'Related titles')); const links = el('div', 'related-links'); for (const item of related) links.append(button(item.title, 'text-button', () => renderDetail(item))); content.append(links); }
  }
  function openDetail(title) { renderDetail(title); if (!$('detail-dialog').open) $('detail-dialog').showModal(); }
  function setView(value) { view = value; if (value === 'essentials') state.preferences.mode = 'essentials'; else if (state.preferences.mode === 'essentials') state.preferences.mode = 'release'; persist(); render(); $('sidebar').classList.remove('is-open'); $('menu-toggle').setAttribute('aria-expanded', 'false'); $('library').scrollIntoView({behavior: 'smooth'}); }
  function clearFilters() { for (const name of ['type', 'universe', 'category', 'phase', 'character', 'year', 'status', 'release', 'importance']) $('filter-' + name).value = ''; $('search').value = ''; $('sort').value = 'release'; state.preferences.hideCompleted = false; state.preferences.mode = 'release'; view = 'all'; collapsed.clear(); persist(); render(); }
  function addOptions(id, options) { for (const value of options) { const opt = el('option', '', String(value)); opt.value = String(value); $(id).append(opt); } }
  for (const category of MarvelData.categories) { const opt = el('option', '', category.label); opt.value = category.id; $('filter-category').append(opt); }
  addOptions('filter-universe', universes); addOptions('filter-phase', [1, 2, 3, 4, 5, 6]); addOptions('filter-character', [...new Set(titles.flatMap(t => t.characters))].sort()); addOptions('filter-year', [...new Set(titles.map(t => t.year).filter(Boolean))].sort((a, b) => b - a));
  universes.forEach((universe, index) => { const nav = button('', 'nav-item universe-link', () => { clearFilters(); $('filter-universe').value = universe; state.preferences.mode = 'universe'; persist(); render(); $('sidebar').classList.remove('is-open'); $('menu-toggle').setAttribute('aria-expanded', 'false'); $('library').scrollIntoView({behavior: 'smooth'}); }); nav.append(el('span', 'universe-dot dot-' + index), el('span', '', universe === 'Sony' ? 'Sony Spider-Man Universe' : universe === 'Defenders' ? 'Defenders Saga' : universe), el('span', 'universe-arrow', '›')); $('universe-nav').append(nav); });
  document.querySelectorAll('[data-view]').forEach(node => node.addEventListener('click', () => setView(node.dataset.view)));
  document.querySelectorAll('[data-mode]').forEach(node => node.addEventListener('click', () => { state.preferences.mode = node.dataset.mode; if (view === 'essentials') view = 'all'; persist(); render(); }));
  for (const name of ['type', 'universe', 'category', 'phase', 'character', 'year', 'status', 'release', 'importance']) $('filter-' + name).addEventListener('change', render);
  $('search').addEventListener('input', renderLibrary); $('sort').addEventListener('change', renderLibrary); $('hide-completed').addEventListener('change', () => { state.preferences.hideCompleted = $('hide-completed').checked; persist(); render(); });
  $('clear-filters').addEventListener('click', clearFilters);
  $('filters-toggle').addEventListener('click', () => { $('more-filters').hidden = !$('more-filters').hidden; $('filters-toggle').setAttribute('aria-expanded', String(!$('more-filters').hidden)); });
  $('theme-toggle').addEventListener('click', () => { state.preferences.theme = state.preferences.theme === 'dark' ? 'light' : 'dark'; persist(); render(); });
  $('density-toggle').addEventListener('click', () => { state.preferences.density = state.preferences.density === 'comfortable' ? 'compact' : 'comfortable'; persist(); render(); });
  $('menu-toggle').addEventListener('click', () => { $('sidebar').classList.toggle('is-open'); $('menu-toggle').setAttribute('aria-expanded', String($('sidebar').classList.contains('is-open'))); });
  $('explore-essentials').addEventListener('click', () => { clearFilters(); setView('essentials'); });
  $('next-open').addEventListener('click', () => { if (nextTitle) openDetail(nextTitle); });
  $('resume').addEventListener('click', () => { const target = nextTitle; if (!target) return; const chosenMode = state.preferences.mode; clearFilters(); state.preferences.mode = chosenMode; persist(); render(); const node = [...document.querySelectorAll('.title-card')].find(n => n.dataset.id === target.id); if (node) { node.closest('details').open = true; node.scrollIntoView({behavior: 'smooth', block: 'center'}); node.querySelector('.card-title').focus({preventScroll: true}); } });
  $('random').addEventListener('click', () => { const list = titles.filter(t => t.type === 'movie' && t.release === 'released' && !['completed', 'skipped'].includes(MarvelCore.record(state, t.id).status)); if (!list.length) return notify('All released movies are completed or skipped.'); openDetail(list[Math.floor(Math.random() * list.length)]); });
  document.querySelectorAll('[data-close]').forEach(node => node.addEventListener('click', () => $(node.dataset.close).close()));
  $('backup-open').addEventListener('click', () => $('settings-dialog').showModal());
  $('confirm-cancel').addEventListener('click', () => { confirmation = null; $('confirm-dialog').close(); });
  $('confirm-accept').addEventListener('click', () => { const action = confirmation; confirmation = null; $('confirm-dialog').close(); if (action) action(); });
  $('confirm-dialog').addEventListener('cancel', () => { confirmation = null; });
  $('export').addEventListener('click', () => { const blob = new Blob([JSON.stringify(MarvelSecurity.validate(state, ids), null, 2)], {type: 'application/json'}); const url = URL.createObjectURL(blob); const a = el('a'); a.href = url; a.download = 'marvel-watchlist-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify('Backup exported. Keep it somewhere safe.'); });
  $('import').addEventListener('change', async event => { const file = event.target.files[0]; event.target.value = ''; if (!file) return; try { if (file.size > MarvelSecurity.MAX_BYTES) throw new Error('Backup exceeds the 1 MB limit.'); const incoming = MarvelSecurity.parse(await file.text(), ids); const s = MarvelCore.stats(titles, incoming); ask(`Replace current data with this backup? It contains ${Object.keys(incoming.records).length} saved records, ${s.completed} completed titles, and ${incoming.planner.length} planner selections. Export first if you need to keep your current progress.`, () => { state = incoming; persist(true); render(); notify('Backup imported.'); }, 'Replace with backup'); } catch (error) { notify('Import rejected: ' + error.message); } });
  $('reset').addEventListener('click', () => ask('Delete all statuses, ratings, notes, favorites and planner selections? This cannot be undone without an exported backup.', () => { state = MarvelStorage.empty(); persist(true); clearFilters(); notify('Your watchlist has been reset.'); }, 'Reset all progress'));
  $('progress-open').addEventListener('click', () => { $('progress-content').replaceChildren(); const groups = [['Movies', titles.filter(t => t.type === 'movie')], ['TV seasons & specials', titles.filter(t => t.type === 'tv')], ...universes.map(u => [u, titles.filter(t => t.universes.includes(u))])]; for (const [label, list] of groups) { const s = MarvelCore.stats(list, state); const row = el('div', 'progress-row'); row.append(el('span', '', label), el('b', '', `${s.completed} / ${s.total} · ${s.percent}%`)); const bar = el('progress'); bar.max = 100; bar.value = s.percent; bar.setAttribute('aria-label', label + ' completion'); row.append(bar); $('progress-content').append(row); } $('progress-content').append(el('p', 'muted', 'Crossover titles count once overall and contribute to each relevant universe. Pending titles remain in totals; skipped titles are not completed.')); $('progress-dialog').showModal(); });
  function updateCountdown() { const days = MarvelCore.daysUntil(); $('countdown-days').textContent = String(days); $('countdown-label').textContent = days ? 'DAYS UNTIL DOOMSDAY' : 'SCHEDULED RELEASE DATE REACHED'; }
  updateCountdown(); setInterval(updateCountdown, 60000); render();
  if (loaded.error) { $('storage-status').textContent = loaded.error; document.querySelector('.local-pill').textContent = '● Saving paused • check settings'; notify(loaded.error); }
})();
