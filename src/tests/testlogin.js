require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.007 - เข้าสู่ระบบสำเร็จ', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');


  
});
