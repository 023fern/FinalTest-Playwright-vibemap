require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 6.0.001 - ดูรายละเอียดสถานที่สำเร็จ', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });

  const page = await context.newPage();

  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');

  // รอข้อมูลโหลดเสร็จก่อนเริ่มทดสอบ
  await page.waitForLoadState('networkidle');

  const emotionBtn = page.locator('button')
    .filter({ hasText: 'เศร้า' })
    .filter({ visible: true })
    .first();

  await emotionBtn.waitFor({ state: 'visible' });
  await emotionBtn.click();

  const categoryBtn = page.getByRole('heading', { name: 'สวนสาธารณะ' });

  await categoryBtn.waitFor({ state: 'visible', timeout: 15000 });
  await categoryBtn.click();

  const viewButton = page.getByRole('button', { name: 'ดูรูปภาพและรีวิว' }).first();

  await viewButton.waitFor({ state: 'visible', timeout: 20000 });
  await viewButton.click();

  // ตรวจสอบว่าเข้าสู่หน้ารายละเอียดสถานที่สำเร็จ
  const navigationBtn = page.getByRole('button', { name: 'นำทาง' });

  await expect(navigationBtn).toBeVisible({ timeout: 15000 });

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_6_0_001_ViewPlaceDetail.png',
    fullPage: true
  });

  await context.close();
});