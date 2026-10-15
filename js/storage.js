'use strict';
window.MarvelStorage = (() => {
  const KEY = 'marvel-watchlist-v1';
  const empty = () => ({version: 1, records: {}, preferences: {theme: 'dark', density: 'comfortable', mode: 'universe', hideCompleted: false}, planner: []});
  let writable = true;
  function load(ids) {
    try { const raw = localStorage.getItem(KEY); return {state: raw === null ? empty() : MarvelSecurity.parse(raw, ids), error: null}; }
    catch (error) { writable = false; return {state: empty(), error: 'Stored progress could not be loaded. It has not been overwritten. Export your current session, or deliberately reset/import to restore saving. ' + error.message}; }
  }
  function save(state, ids, deliberate = false) {
    if (!writable && !deliberate) return 'Automatic saving is paused to protect existing stored data.';
    try { const safe = MarvelSecurity.validate(state, ids); localStorage.setItem(KEY, JSON.stringify(safe)); writable = true; return null; }
    catch { return 'Browser storage is unavailable or full. Export a backup to keep this session.'; }
  }
  return {KEY, empty, load, save};
})();
