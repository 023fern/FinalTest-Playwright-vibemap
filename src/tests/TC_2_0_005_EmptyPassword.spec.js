require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 2.0.005 - เข้าสู่ระบบไม่สำเร็จเนื่องจากไม่กรอกรหัสผ่าน', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
 await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.click('button[type="submit"]');

const emailInput = page.getByPlaceholder('your@email.com');

await expect(emailInput).toBeVisible();
await expect(page.getByText('กรุณากรอกรหัสผ่าน')).toBeVisible();
  

  await page.screenshot({
  path: 'evidence/TC_2_0_005_EmptyPassword.png',
  fullPage: true
});
});