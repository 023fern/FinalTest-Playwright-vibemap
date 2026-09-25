require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 7.0.002 - การบันทึกรายการโปรดไม่สำเร็จเนื่องจากรายการเต็ม', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });
  const page = await context.newPage();

  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // ใช้ getByRole ร่วมกับ Regex เพื่อหาปุ่มอารมณ์ที่มี Emoji ได้
  const emotionBtn = page.getByRole('button', { name: /มีความสุข/ });
  await emotionBtn.waitFor({ state: 'visible', timeout: 10000 });
  await emotionBtn.click();

  const categoryBtn = page.getByRole('heading', { name: 'สวนสนุก' });
  await categoryBtn.click();
  
  const viewButton = page.getByRole('button', { name: 'ดูรูปภาพและรีวิว' }).first();
  await viewButton.waitFor({ state: 'visible', timeout: 15000 });
  await viewButton.click();

  const heartBtn = page.locator('main button').nth(1);
  await heartBtn.click();

  // รอ 2 วิเพื่อแคปรูปยืนยันว่าระบบขึ้น "บันทึกสำเร็จ" ทั้งที่ควรจะ "เต็ม" (Logic Bug)
  await page.waitForTimeout(2000); 
  await page.screenshot({ path: 'evidence/TC_7_0_002_FavoriteFull_Actual.png', fullPage: true });

  // บรรทัดนี้จะ Error เพราะระบบจริงไม่มีแจ้งเตือนว่ารายการเต็มตาม Requirement
  await expect(page.getByText(/เต็ม|จำกัด|full/i)).toBeVisible({ timeout: 5000 });
});