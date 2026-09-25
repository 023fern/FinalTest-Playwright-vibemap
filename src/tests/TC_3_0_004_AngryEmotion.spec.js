require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 3.0.004 - เลือกความรู้สึกโกรธสำเร็จ', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');

  // รอ networkidle เพื่อให้มั่นใจว่า API โหลดข้อมูลอารมณ์มาครบก่อนเริ่มกด
  await page.waitForLoadState('networkidle');

  await page.locator('button')
    .filter({ hasText: 'โกรธ' })
    .filter({ visible: true })
    .first()
    .click();

  // ตรวจสอบว่าหมวดหมู่ที่เกี่ยวข้องถูกแสดง
  await expect(page.getByText('ยิมออกกำลังกาย')).toBeVisible();
  await expect(page.getByText('ค่ายมวย')).toBeVisible();
  await expect(page.getByText('สนามกีฬา')).toBeVisible();
  
await page.evaluate(() => {
  window.scrollTo(0, 0);
});

await page.screenshot({
  path: 'evidence/TC_3_0_004_AngryEmotion.png',
  fullPage: true
});
});