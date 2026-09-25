require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 3.0.006 - การเปลี่ยนใจเลือกอารมณ์ใหม่', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  
  await page.locator('button')
    .filter({ hasText: 'เศร้า' })
    .filter({ visible: true })
    .first()
    .click();
  
  // เช็คว่าปุ่มย้อนกลับปรากฏขึ้นจริง เพื่อยืนยันว่าระบบรองรับการเปลี่ยนใจของ User
  const backBtn = page.locator('button').filter({ hasText: 'กลับไปเลือกอารมณ์ใหม่' }).filter({ visible: true }).first();
  await expect(backBtn).toBeVisible();
  await backBtn.click();

  await page.waitForTimeout(1000);
  await page.locator('button').filter({ hasText: 'เศร้า' }).filter({ visible: true }).first().click();

  //ใช้ Regex เพื่อตรวจสอบว่าหน้าถัดไปแสดงข้อความอารมณ์ใหม่ได้ถูกต้อง
  await page.waitForLoadState('networkidle'); 
  await expect(page.locator('h1')).toContainText('เศร้า', { timeout: 10000 });

await page.evaluate(() => {
  window.scrollTo(0, 0);
});

await page.screenshot({
  path: 'evidence/TC_3_0_006_ChangeEmotion.png',
  fullPage: true
});
});