import { defineConfig, chromium } from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.js',timeout:60000,workers:1,use:{baseURL:process.env.PALAMEDES_URL||'http://127.0.0.1:5173',viewport:{width:1600,height:1100},headless:true,launchOptions:{executablePath:chromium.executablePath()}},reporter:'list'});
