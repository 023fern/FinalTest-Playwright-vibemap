require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 8.0.002 - วางแผนการเดินทางไม่สำเร็จ', async ({ page }) => {

  // Login
  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com')
    .fill('664259023@webmail.npru.ac.th');

  await page.locator('input[type="password"]')
    .fill('111111');

  await page.click('button[type="submit"]');

  await page.waitForLoadState('networkidle');

  // เปิดเมนู
  const menuBtn = page.locator('.hamburger-icon');

  await expect(menuBtn).toBeVisible();
  await menuBtn.click();

  // ไปหน้าแผนการเดินทาง
  await page.getByText('วางแผนการเดินทาง').click();

  // ตรวจสอบข้อความแจ้งเตือน
  await expect(page.locator('body'))
    .toContainText('ยังไม่มีรายการที่บันทึกไว้');

  // Screenshot
  await page.screenshot({
    path: 'evidence/TC_8_0_002_PlanFail.png',
    fullPage: true
  });

});