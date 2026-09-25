require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 2.0.002 - เข้าสู่ระบบไม่สำเร็จอีเมลไม่ถูกต้อง', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('664259027@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');

 const successToast = page.getByText(/เข้าสู่ระบบไม่สำเร็จ|เข้าสู่ระบบไม่สำเร็จอีเมลหรือรหัสผ่านไม่ถูกต้อง|/).first();
  
  await expect(successToast).toBeVisible({ timeout: 15000 });
await page.waitForTimeout(1000);
  await page.screenshot({
  path: 'evidence/TC_2_0_002_InvalidEmail.png',
  fullPage: true
});
});