require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.010 - เข้าสู่ระบบไม่สำเร็จ - ไม่กรอกอีเมล', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('');
  await page.locator('input[type="password"]').fill('Bfxrn4444-');
  await page.click('button[type="submit"]');

await expect(
  page.getByText('กรุณากรอกอีเมล', { exact: true })
).toBeVisible();


  
await page.waitForTimeout(1000);
  await page.screenshot({
  path: 'evidence/TC_1_0_010_EmptyEmail.png',
  fullPage: true
});
});