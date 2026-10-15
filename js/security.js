'use strict';
window.MarvelSecurity = (() => {
  const MAX_BYTES = 1024 * 1024;
  const statuses = ['not-started', 'watching', 'completed', 'skipped'];
  const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
  const keys = (value, allowed) => plain(value) && Object.keys(value).every(key => allowed.includes(key));
  function validate(value, ids) {
    if (!keys(value, ['version', 'records', 'preferences', 'planner']) || value.version !== 1 || !plain(value.records)) throw new Error('This is not a supported watchlist backup.');
    if (Object.keys(value.records).length > ids.size) throw new Error('Too many records.');
    const records = {};
    for (const [id, record] of Object.entries(value.records)) {
      if (!ids.has(id) || !keys(record, ['status', 'favorite', 'rating', 'notes']) || !statuses.includes(record.status) || typeof record.favorite !== 'boolean' || !Number.isInteger(record.rating) || record.rating < 0 || record.rating > 10 || typeof record.notes !== 'string' || record.notes.length > 2000) throw new Error('A watchlist record is invalid.');
      records[id] = {status: record.status, favorite: record.favorite, rating: record.rating, notes: record.notes};
    }
    const p = value.preferences;
    if (!keys(p, ['theme', 'density', 'mode', 'hideCompleted']) || !['dark', 'light'].includes(p.theme) || !['comfortable', 'compact'].includes(p.density) || !['release', 'universe', 'essentials'].includes(p.mode) || typeof p.hideCompleted !== 'boolean') throw new Error('Backup preferences are invalid.');
    if (!Array.isArray(value.planner) || value.planner.length > ids.size || value.planner.some(id => typeof id !== 'string' || !ids.has(id)) || new Set(value.planner).size !== value.planner.length) throw new Error('Session planner is invalid.');
    return {version: 1, records, preferences: {theme: p.theme, density: p.density, mode: p.mode, hideCompleted: p.hideCompleted}, planner: [...value.planner]};
  }
  function parse(text, ids) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('Backup exceeds the 1 MB limit.');
    let value;
    try { value = JSON.parse(text); } catch { throw new Error('The backup is not valid JSON.'); }
    return validate(value, ids);
  }
  function imageURL(value) {
    if (typeof value !== 'string') return null;
    try { const url = new URL(value); return url.protocol === 'https:' && ['cdn.marvel.com', 'image.tmdb.org', 'upload.wikimedia.org', 'm.media-amazon.com', 'lumiere-a.akamaihd.net', 'www.sonypictures.com'].includes(url.hostname) && !url.username && !url.password ? url.href : null; } catch { return null; }
  }
  return {MAX_BYTES, statuses, validate, parse, imageURL};
})();
