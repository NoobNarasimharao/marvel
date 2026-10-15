'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const assert = require('node:assert/strict');
const {HtmlValidate} = require('html-validate');
async function main() {
  const html = fs.readFileSync('index.html','utf8');
  const validator = new HtmlValidate({extends:['html-validate:recommended']});
  const report = await validator.validateString(html,'index.html');
  if (!report.valid) { console.error(report.results.flatMap(r=>r.messages)); throw new Error('HTML validation failed'); }
  const files = ['index.html','css/style.css',...fs.readdirSync('js').filter(n=>n.endsWith('.js')).map(n=>'js/'+n)];
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
  for(const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const target = match[1]; if(target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), 'Broken fragment: '+target);
    else { assert.ok(!target.startsWith('/'),'Root-relative asset breaks GitHub Pages subpaths'); assert.ok(fs.existsSync(target),'Missing asset: '+target); }
  }
  for(const file of files) {
    const text=fs.readFileSync(file,'utf8');
    if(file.endsWith('.js')) { execFileSync(process.execPath,['--check',file]); assert.ok(!/\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML\s*\(|\beval\s*\(|new\s+Function\s*\(|document\.write\s*\(/.test(text),'Unsafe DOM/code execution sink in '+file); }
    assert.ok(!/\bon\w+\s*=\s*["']/.test(file.endsWith('.html')?text:''),'Inline event handler');
    const secrets = [new RegExp('gh'+'[pousr]_[A-Za-z0-9]{36,}'),new RegExp('github'+'_pat_[A-Za-z0-9_]{50,}'),new RegExp('AK'+'IA[0-9A-Z]{16}'),new RegExp('-----BEGIN '+'(?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),new RegExp('sk'+'-proj-[A-Za-z0-9_-]{40,}')];
    assert.ok(!secrets.some(pattern=>pattern.test(text)),'Possible credential in '+file);
  }
  const workflow = fs.readFileSync('.github/workflows/deploy.yml','utf8');
  for(const match of workflow.matchAll(/uses:\s*([^\s]+)/g)) assert.match(match[1],/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+@[a-f0-9]{40}$/,'Action must use full SHA');
  console.log('HTML, local links/assets, JavaScript syntax, source safety patterns, common credential patterns and workflow pins passed. These targeted checks are not a security audit.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
