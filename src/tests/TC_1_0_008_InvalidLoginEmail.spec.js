require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.008 - เข้าสู่ระบบไม่สำเร็จอีเมลไม่ถูกต้อง', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptest@tmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');

 const successToast = page.getByText(/เข้าสู่ระบบไม่สำเร็จ|เข้าสู่ระบบไม่สำเร็จอีเมลหรือรหัสผ่านไม่ถูกต้อง|/).first();
  
  await expect(successToast).toBeVisible({ timeout: 15000 });
await page.waitForTimeout(1000);
  await page.screenshot({
  path: 'evidence/TC_1_0_008_InvalidEmail.png',
  fullPage: true
});
});