'use strict';
window.MarvelCore = (() => {
  const record = (state, id) => state.records[id] || {status: 'not-started', favorite: false, rating: 0, notes: ''};
  function stats(titles, state) {
    const unique = [...new Map(titles.map(t => [t.id, t])).values()];
    const completed = unique.filter(t => record(state, t.id).status === 'completed').length;
    return {total: unique.length, completed, watching: unique.filter(t => record(state, t.id).status === 'watching').length, remaining: unique.length - completed, percent: unique.length ? Math.round(completed / unique.length * 100) : 0};
  }
  function filter(titles, state, f) {
    const q = (f.search || '').trim().toLocaleLowerCase();
    return titles.filter(t => {
      const r = record(state, t.id);
      return (!q || [t.title, t.series, ...(t.aliases || []), ...t.characters].join(' ').toLocaleLowerCase().includes(q)) && (!f.category || t.categories.includes(f.category)) && (!f.type || t.type === f.type) && (!f.universe || t.universes.includes(f.universe)) && (!f.phase || String(t.phase) === f.phase) && (!f.character || t.characters.includes(f.character)) && (!f.year || String(t.year) === f.year) && (!f.status || (f.status === 'unwatched' ? !['completed', 'skipped'].includes(r.status) : r.status === f.status)) && (!f.release || t.release === f.release) && (!f.importance || (f.importance === 'essential' ? t.essential : !t.essential)) && (!f.hideCompleted || r.status !== 'completed') && (!f.essential || t.essential) && (!f.favorites || r.favorite) && (!f.upcoming || t.release !== 'released' || t.categories.includes('upcoming')) && (!f.planner || state.planner.includes(t.id));
    });
  }
  function sort(titles, state, mode) {
    const releaseKey = t => t.date || (t.year ? `${t.year}-00-00` : '9999');
    return [...titles].sort((a, b) => {
      if (mode === 'title') return a.title.localeCompare(b.title);
      if (mode === 'status') return MarvelSecurity.statuses.indexOf(record(state, a.id).status) - MarvelSecurity.statuses.indexOf(record(state, b.id).status) || a.title.localeCompare(b.title);
      if (mode === 'recommended') return a.recommended - b.recommended || releaseKey(a).localeCompare(releaseKey(b));
      return releaseKey(a).localeCompare(releaseKey(b)) || a.recommended - b.recommended || a.title.localeCompare(b.title);
    });
  }
  function next(titles, state) { return titles.find(t => t.release === 'released' && !['completed', 'skipped'].includes(record(state, t.id).status)); }
  function daysUntil(now = Date.now()) { return Math.max(0, Math.ceil((Date.UTC(2026, 11, 18) - now) / 86400000)); }
  return {record, stats, filter, sort, next, daysUntil};
})();
