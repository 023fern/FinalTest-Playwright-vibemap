require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.011 - เข้าสู่ระบบไม่สำเร็จ - ไม่กรอกรหัสผ่าน', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptest@gmail.com');
  await page.locator('input[type="password"]').fill('');
  await page.click('button[type="submit"]');

await expect(
  page.getByText('กรุณากรอกรหัสผ่าน', { exact: true })
).toBeVisible();
  

  await page.screenshot({
  path: 'evidence/TC_1_0_011_EmptyPassword.png',
  fullPage: true
});
});