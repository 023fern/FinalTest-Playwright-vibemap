require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 3.0.003 - เลือกความรู้สึกมีความสุขสำเร็จ', async ({ page }) => {
  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com')
    .fill('664259023@webmail.npru.ac.th');

  await page.locator('input[type="password"]')
    .fill('111111');

  await page.click('button[type="submit"]');

  await page.waitForLoadState('networkidle');

  await page.locator('button')
    .filter({ hasText: 'มีความสุข' })
    .filter({ visible: true })
    .first()
    .click();

  // ตรวจสอบว่าหมวดหมู่ที่เกี่ยวข้องถูกแสดง
  await expect(page.getByText('สวนสนุก')).toBeVisible();
  await expect(page.getByText('งาน Event')).toBeVisible();
  
await page.evaluate(() => {
  window.scrollTo(0, 0);
});

await page.screenshot({
  path: 'evidence/TC_3_0_003_HappyEmotion.png',
  fullPage: true
});
});