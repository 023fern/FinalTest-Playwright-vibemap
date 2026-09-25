require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 2.0.004 - เข้าสู่ระบบไม่สำเร็จเนื่องจากไม่กรอกอีเมล', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');

const emailInput = page.getByPlaceholder('your@email.com');

await expect(emailInput).toBeVisible();
await expect(page.getByText('กรุณากรอกอีเมล')).toBeVisible();
  

  await page.screenshot({
  path: 'evidence/TC_2_0_004_EmptyEmail.png',
  fullPage: true
});
});