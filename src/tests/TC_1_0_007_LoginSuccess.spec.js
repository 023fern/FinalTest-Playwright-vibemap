require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.007 - เข้าสู่ระบบสำเร็จ', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');

 const successToast = page.getByText(/เข้าสู่ระบบเรียบร้อยแล้ว|เข้าสู่ระบบแล้ว|/).first();
  
await expect(successToast).toBeVisible();
    // แคปหน้าจอ
  await page.evaluate(() => {
  window.scrollTo(0, 0);
});

  await page.screenshot({
    path: 'evidence/TC_1_0_007_LoginSuccess.png',
    fullPage: true,
  });

});