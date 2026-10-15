'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
global.window = global;
const memory = new Map();
global.localStorage = {getItem: k => memory.get(k) ?? null, setItem: (k,v) => memory.set(k,v)};
for (const name of ['data','security','storage','core']) vm.runInThisContext(fs.readFileSync(`js/${name}.js`, 'utf8'), {filename: name + '.js'});
const {titles} = MarvelData; const ids = new Set(titles.map(t => t.id));
test('complete library and independent seasons without duplicated crossover records', () => {
  assert.ok(titles.length >= 186); assert.equal(titles.length, ids.size);
  assert.equal(titles.filter(t => t.title === 'Deadpool & Wolverine').length, 1);
  assert.equal(titles.filter(t => t.series === 'Agents of S.H.I.E.L.D.').length, 7);
  assert.equal(titles.filter(t => t.series === 'Loki').length, 2);
  assert.equal(titles.filter(t => t.essential).length, 17);
  assert.equal(titles.filter(t => t.type === 'movie' && t.phase === 1).length, 6);
  for (const t of titles) { assert.ok(t.synopsis); assert.ok(t.continuity); assert.ok(t.categories.every(c => MarvelData.categories.some(x => x.id === c))); assert.ok(t.related.every(id => ids.has(id))); assert.ok(['released','upcoming','unconfirmed'].includes(t.release)); if(t.poster) assert.ok(MarvelSecurity.imageURL(t.poster), t.poster); }
});
test('combined search, universe, type, phase, year, status and importance filters', () => {
  const s = MarvelStorage.empty();
  const matched = MarvelCore.filter(titles, s, {search:'iron man', universe:'MCU',type:'movie',phase:'1',year:'2008'});
  assert.equal(matched.length,1); assert.equal(matched[0].id,'iron-man-2008');
  s.records[matched[0].id] = {status:'completed',favorite:true,rating:9,notes:''};
  assert.equal(MarvelCore.filter(matched,s,{hideCompleted:true}).length,0);
  assert.equal(MarvelCore.filter(matched,s,{favorites:true,status:'completed'}).length,1);
  assert.equal(MarvelCore.filter(titles,s,{importance:'essential'}).length,17);
  assert.ok(MarvelCore.filter(titles,s,{search:'Marvel Super Hero Squad'}).length);
  assert.equal(MarvelCore.filter(titles,s,{category:'mcu-movies',phase:'2'}).length,6);
});
test('statistics count unique records, distinguish skipped and watching, and handle empty sets', () => {
  const s = MarvelStorage.empty(); const [a,b,c] = titles;
  s.records[a.id]={status:'completed',favorite:false,rating:0,notes:''}; s.records[b.id]={status:'watching',favorite:false,rating:0,notes:''}; s.records[c.id]={status:'skipped',favorite:false,rating:0,notes:''};
  assert.deepEqual(MarvelCore.stats([a,a,b,c],s),{total:3,completed:1,watching:1,remaining:2,percent:33});
  assert.equal(MarvelCore.stats([],s).percent,0);
  assert.equal(MarvelCore.next([a,c,b],s).id,b.id);
  assert.equal(MarvelCore.next(titles.filter(t => t.release !== 'released'),s),undefined);
});
test('sorts correctly and countdown clamps to zero after release', () => {
  const s = MarvelStorage.empty(); const list = MarvelCore.sort(titles,s,'title'); assert.equal(list[0].title,[...titles].sort((a,b)=>a.title.localeCompare(b.title))[0].title);
  assert.equal(MarvelCore.daysUntil(Date.UTC(2026,11,17)),1); assert.equal(MarvelCore.daysUntil(Date.UTC(2027,0,1)),0);
});
test('backup round trip and localStorage persistence', () => {
  const s = MarvelStorage.empty(); s.records[titles[0].id]={status:'completed',favorite:true,rating:10,notes:'Remember this'}; s.planner=[titles[1].id];
  assert.equal(MarvelStorage.save(s,ids,true),null); assert.deepEqual(MarvelStorage.load(ids).state,s); assert.deepEqual(MarvelSecurity.parse(JSON.stringify(s),ids),s);
});
test('strict import rejects malformed, oversized, unknown fields and prototype pollution', () => {
  const s = MarvelStorage.empty();
  assert.throws(()=>MarvelSecurity.parse('{',ids)); assert.throws(()=>MarvelSecurity.parse(' '.repeat(MarvelSecurity.MAX_BYTES+1),ids));
  assert.throws(()=>MarvelSecurity.validate({...s,unexpected:true},ids));
  assert.throws(()=>MarvelSecurity.parse(JSON.stringify(s).replace('"records":{}','"records":{"__proto__":{"status":"completed"}}'),ids));
  assert.throws(()=>MarvelSecurity.validate({...s,planner:['unknown']},ids));
  assert.throws(()=>MarvelSecurity.validate({...s,planner:[titles[0].id,titles[0].id]},ids));
  for(const bad of [{status:'evil',favorite:false,rating:0,notes:''},{status:'completed',favorite:false,rating:11,notes:''},{status:'completed',favorite:false,rating:0,notes:'x'.repeat(2001)},{status:'completed',favorite:false,rating:0,notes:'',extra:true}]) assert.throws(()=>MarvelSecurity.validate({...s,records:{[titles[0].id]:bad}},ids));
});
test('corrupt stored data is preserved until deliberate recovery', () => {
  memory.set(MarvelStorage.KEY,'{broken'); const loaded = MarvelStorage.load(ids); assert.ok(loaded.error); assert.equal(MarvelStorage.save(MarvelStorage.empty(),ids), 'Automatic saving is paused to protect existing stored data.'); assert.equal(memory.get(MarvelStorage.KEY),'{broken'); assert.equal(MarvelStorage.save(MarvelStorage.empty(),ids,true),null);
});
test('image URL allowlist blocks executable schemes and deceptive hosts', () => {
  for(const url of ['javascript:alert(1)','data:image/svg+xml,test','http://cdn.marvel.com/x','https://cdn.marvel.com.evil.test/x','https://user:pass@cdn.marvel.com/x']) assert.equal(MarvelSecurity.imageURL(url),null);
  assert.ok(MarvelSecurity.imageURL('https://cdn.marvel.com/test.jpg'));
});
