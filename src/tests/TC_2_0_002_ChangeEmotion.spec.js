require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 2.0.002 - การเปลี่ยนความรู้สึกที่เลือก', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('example@mail.com')
    .fill('vibemaptester@gmail.com');

  await page.locator('input[type="password"]')
    .fill('Bfxrn2547-');

   await page.click('button[type="submit"]');

const angryButton = page.getByRole('button', { name: /โกรธ/ });

await expect(angryButton).toBeVisible({ timeout: 10000 });
await angryButton.click();

  // ตรวจสอบว่าปุ่มเปลี่ยนความรู้สึกแสดง
  const backBtn = page
    .locator('button:visible')
    .filter({ hasText: 'กลับไปเลือกอารมณ์ใหม่' })
    .first();

  await expect(backBtn).toBeVisible({ timeout: 10000 });

  await backBtn.click();

  // รอให้อารมณ์ใหม่แสดงก่อนคลิก
  const happyButton = page.getByRole('button', { name: /มีความสุข/ });

await expect(happyButton).toBeVisible({ timeout: 10000 });
await happyButton.click();

  // ตรวจสอบว่าอารมณ์ใหม่แสดง
// ตรวจสอบว่าอารมณ์ใหม่แสดง
await expect(
  page.getByRole('heading', { name: /ตอนนี้คุณ มีความสุข/ })
).toBeVisible({ timeout: 10000 });

  // แคปหลักฐาน
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_2_0_002_ChangeEmotion.png',
    fullPage: true
  });
});