const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'); const FPS=30, DUR=27.5; fs.mkdirSync(__dirname+'/frames',{recursive:true});
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+__dirname+'/index.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
  const N=Math.round(FPS*DUR);
  for(let i=0;i<N;i++){ await p.evaluate(t=>render(t), i/FPS); await p.screenshot({path:`${__dirname}/frames/f${String(i).padStart(4,'0')}.jpg`, type:'jpeg', quality:94}); }
  await b.close(); console.log('frames',N); })();
