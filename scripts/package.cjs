'use strict';
const fs=require('node:fs'); const path=require('node:path');
const root=path.resolve(__dirname,'..'); const target=path.join(root,'dist');
// Generated output is isolated inside the repository; never package the checkout wholesale.
if(path.dirname(target)!==root||path.basename(target)!=='dist')throw new Error('Unsafe output directory');
fs.rmSync(target,{recursive:true,force:true}); fs.mkdirSync(target,{recursive:true});
for(const entry of ['index.html','css','js','assets'])fs.cpSync(path.join(root,entry),path.join(target,entry),{recursive:true});
console.log('Production allowlist copied to dist: index.html, css/, js/, assets/.');
