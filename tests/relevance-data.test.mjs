import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
const read = name => JSON.parse(fs.readFileSync(new URL(`../${name}`, import.meta.url),'utf8'));
const summary=read('data/relevance-summary.json');
const historical=read('data/historical-relevance.json');
const expanded=read('data/reviewed-search-completion-2026-09-07.json');
const audit=read('public-data/relevance-audit-2026-09-08.json');
test('every published capability has exactly one auditable relevance decision',()=>{
 const all=[...Object.values(historical),...expanded.map(c=>c.relevance)];
 assert.equal(all.length,6227);
 assert.equal(new Set(all.map(r=>r.id)).size,6227);
 assert.equal(all.some(r=>r.id==='RWE-0115'),false);
 assert.equal(audit.records.length,6227);
 for(const decision of ['Core','Archive','Borderline']) assert.equal(all.filter(r=>r.decision===decision).length,summary.counts[decision]);
 assert.equal(Object.values(summary.counts).reduce((a,b)=>a+b,0),6227);
 const indexed=new Map(audit.records.map(r=>[r.id,r]));
 for(const r of all){assert.ok(r.rationale.length>30);assert.deepEqual(r,indexed.get(r.id));}
});
test('adjacent disaster discoveries remain available outside core',()=>{
 const earthquakes=expanded.filter(c=>/earthquake/i.test(c.name+' '+c.summary));
 assert.ok(earthquakes.length>0);
 const general=earthquakes.filter(c=>!/(epidemiolog|health impact|health outcome)/i.test(c.summary));
 assert.ok(general.length>0);
 for(const c of general) assert.notEqual(c.relevance.decision,'Core',c.id+' '+c.name);
 assert.equal(historical['RWE-0204'].decision,'Archive');
 assert.equal(historical['RWE-0843'].decision,'Core');
});
test('download and browser copies use the identical audit and capability dataset',()=>{
 for(const [a,b] of [['public-data/relevance-audit-2026-09-08.json','public/public-data/relevance-audit-2026-09-08.json'],['data/reviewed-search-completion-2026-09-07.json','public/data/reviewed-search-completion-2026-09-07.json']]) assert.deepEqual(read(a),read(b));
});
