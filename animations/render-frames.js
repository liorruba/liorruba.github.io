// usage: node frames.js keys NAME "[t1,t2,...]"   |   node frames.js all NAME DURATION_SECONDS
const { chromium } = require('playwright-core');
const fs = require('fs');
(async () => {
  const [,, mode, name, arg] = process.argv;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: {width:1200,height:800} });
  const errs=[]; p.on('pageerror', e=>errs.push(e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text())});
  await p.goto('file://' + process.cwd() + '/' + name + '.html?still');
  await p.evaluate(()=>window.ready);
  const times = mode === 'keys' ? JSON.parse(arg) : [...Array(Math.round(parseFloat(arg)*30)).keys()].map(i=>i/30);
  if (mode !== 'keys') fs.mkdirSync('frames_'+name, {recursive:true});
  for (let i=0;i<times.length;i++){
    await p.evaluate(t=>renderAt(t), times[i]);
    const out = mode === 'keys' ? `key_${name}_${i}.png` : `frames_${name}/${String(i).padStart(4,'0')}.png`;
    await p.screenshot({ path: out });
  }
  console.log('errors', errs);
  await b.close();
})();
