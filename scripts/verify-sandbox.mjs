import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const executablePath=process.env.PALAMEDES_BROWSER_PATH||(existsSync(edge)?edge:chromium.executablePath());
const browser=process.env.PALAMEDES_CDP_URL?await chromium.connectOverCDP(process.env.PALAMEDES_CDP_URL):await chromium.launch({headless:true,executablePath});
try{
  const context=await browser.newContext();
  const page=await context.newPage();
  await page.goto(process.env.PALAMEDES_TEST_URL||'http://127.0.0.1:5173',{waitUntil:'domcontentloaded',timeout:120000});
  await page.getByText('Code sandbox',{exact:true}).first().click({timeout:30000});
  const editor=page.getByRole('textbox',{name:'Program code'}),run=page.getByRole('button',{name:'Run program',exact:true});
  await run.waitFor({timeout:30000});
  async function execute(code){await editor.fill(code);await run.click();}
  await execute("print('math-result', math.sqrt(144)); plot([0,1,2],[0,1,4],'Verification plot'); return math.det([[1,2],[3,4]]);");
  await page.waitForFunction(()=>document.querySelector('.sandbox-output')?.textContent.includes('↳ -2'));
  assert.match(await page.locator('.sandbox-output').innerText(),/math-result 12/);
  assert.equal(await page.locator('.sandbox-plot figcaption').innerText(),'Verification plot');
  console.log('PASS JavaScript math, output, return value, and plot.');
  await execute('while (true) {}');
  await page.locator('.sandbox-error').waitFor({timeout:10000});
  assert.match(await page.locator('.sandbox-error').innerText(),/5-second limit/);
  console.log('PASS infinite loop terminates.');
  const start=Date.now();
  await execute("setInterval(()=>self.postMessage({type:'ready'}),100); await new Promise(()=>{});");
  await page.locator('.sandbox-error').waitFor({timeout:10000});
  assert.ok(Date.now()-start<9000,'Repeated ready messages must not extend execution.');
  assert.match(await page.locator('.sandbox-error').innerText(),/5-second limit/);
  console.log('PASS user-forged ready messages cannot reset timeout.');
  let externalRequest=false;
  await page.route('https://example.com/**',route=>{externalRequest=true;return route.abort();});
  await execute("try { await fetch('https://example.com/palamedes-test'); return 'unexpected network'; } catch { print('NETWORK BLOCKED'); return 'blocked'; }");
  await page.waitForFunction(()=>document.querySelector('.sandbox-output')?.textContent.includes('NETWORK BLOCKED'));
  assert.equal(externalRequest,false,'CSP must block request before network interception.');
  console.log('PASS external fetch blocked by CSP.');
  await execute("print('document:', typeof document, 'storage:', typeof localStorage); return 'isolated';");
  await page.waitForFunction(()=>document.querySelector('.sandbox-output')?.textContent.includes('↳ isolated'));
  assert.match(await page.locator('.sandbox-output').innerText(),/document: undefined storage: undefined/);
  assert.equal(await page.locator('iframe[title="Isolated program runtime"]').getAttribute('sandbox'),'allow-scripts');
  console.log('PASS runtime has no DOM or host storage, iframe is opaque-origin.');
  if(process.env.PALAMEDES_TEST_OCR==='1'){
    const png=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=720;canvas.height=170;const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,720,170);c.fillStyle='#000';c.font='bold 62px Arial';c.fillText('2x + 3 = 11',55,108);return canvas.toDataURL('image/png');});
    await page.getByText('Solve & understand',{exact:true}).first().click();
    await page.locator('input[type="file"][accept="image/*"]').setInputFiles({name:'printed-equation.png',mimeType:'image/png',buffer:Buffer.from(png.split(',')[1],'base64')});
    await page.getByRole('button',{name:'Read text',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.solver-progress')?.textContent.includes('OCR confidence'),{timeout:120000});
    const extracted=await page.locator('#problem-text').inputValue();
    assert.match(extracted,/2\s*x\s*\+\s*3\s*=\s*11/i);
    await page.getByLabel('I checked that the text matches the image.').check();
    await page.getByRole('button',{name:'Show me the working',exact:true}).click();
    await page.locator('.solver-answer strong').waitFor();
    assert.equal(await page.locator('.solver-answer strong').innerText(),'x = 4');
    assert.match(await page.locator('.solver-checks').innerText(),/Checks passed/);
    console.log('PASS OCR printed equation -> corrected/confirmed text -> worked solution x=4 -> substitution check.');
  }
  await context.close();
}finally{if(!process.env.PALAMEDES_CDP_URL)await browser.close();}
// A caller-owned CDP browser stays open for subsequent visual QA.
if(process.env.PALAMEDES_CDP_URL)process.exit(0);
