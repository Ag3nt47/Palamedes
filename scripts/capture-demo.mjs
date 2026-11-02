import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.PALAMEDES_URL||'http://127.0.0.1:5173';
const output=new URL('../docs/media/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PALAMEDES_BROWSER_PATH||chromium.executablePath(),args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function screenshot(name){await page.mouse.move(1550,1080);await page.waitForTimeout(500);await page.screenshot({path:new URL(name+'.png',output).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:false});console.log('Captured '+name)}
async function nav(name){await page.locator('.sidebar-nav').getByRole('button',{name,exact:true}).click();await page.waitForTimeout(500);await page.locator('.workspace-loading').waitFor({state:'hidden',timeout:60000});}
await page.goto(base);await page.waitForSelector('#expression');await page.waitForTimeout(1200);
for(const expr of ['5 cm to inch','(3 + 2i) * (1 - i)','sqrt(144) + 2^5']){await page.getByLabel('Calculation',{exact:true}).fill(expr);await page.getByLabel('Calculate',{exact:true}).click();}
await screenshot('calculator');
await nav('Graphing');await page.waitForSelector('.plot-container .main-svg',{timeout:60000});await page.getByRole('button',{name:/Trigonometric waves/}).click();await screenshot('graphing');
await page.getByLabel('Graph type').selectOption('surface');await page.waitForTimeout(1800);await screenshot('surface');
await nav('Solve & understand');await page.locator('#problem-text').fill('x^2 - 5*x + 6 = 0');await page.getByRole('button',{name:'Show me the working'}).click();await page.waitForSelector('.solver-answer');await screenshot('solver');
await nav('AI math lab');await page.locator('.ml-lab form').getByRole('button',{name:/Calculate/}).click();await page.waitForTimeout(300);await screenshot('ml-lab');
await page.getByRole('tab',{name:'Train weights'}).click();await page.locator('.ml-lab form').getByRole('button',{name:/Calculate/}).click();await screenshot('training');
await nav('Code sandbox');await page.getByRole('button',{name:'Run program',exact:true}).waitFor({state:'visible'});await page.getByRole('button',{name:'Run program',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.sandbox-output')?.textContent.includes('Result')||document.querySelector('.sandbox-result'),{timeout:20000});await screenshot('sandbox');
await nav('Equation handbook');await page.getByLabel('Search textbook').fill('quadratic');await page.locator('.textbook-card-toggle').first().click();await screenshot('handbook');
await page.getByTitle('Settings',{exact:true}).click();await screenshot('settings');await page.getByLabel('Close settings').click();
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open navigation'}).click();await nav('Calculate');await screenshot('mobile');
await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log('All screenshots captured without page errors.');
