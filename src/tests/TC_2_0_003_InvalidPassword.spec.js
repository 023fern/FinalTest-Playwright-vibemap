require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 2.0.003 - เข้าสู่ระบบไม่สำเร็จรหัสผ่านไม่ถูกต้อง', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('123456');
  await page.click('button[type="submit"]');

 const successToast = page.getByText(/เข้าสู่ระบบไม่สำเร็จ|เข้าสู่ระบบไม่สำเร็จอีเมลหรือรหัสผ่านไม่ถูกต้อง|/).first();
  
  await expect(successToast).toBeVisible({ timeout: 15000 });
await page.waitForTimeout(1000);
  await page.screenshot({
  path: 'evidence/TC_2_0_003_InvalidPassword.png',
  fullPage: true
});
});