require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 5.0.001 - ดูรายละเอียดสถานที่สำเร็จ', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });

  const page = await context.newPage();

  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
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
 // 1. ตรวจว่ามีชื่อสถานที่
const placeName = page.locator('main h1').first();
await expect(placeName).toBeVisible({ timeout: 15000 });

// 2. ตรวจว่ามีที่อยู่
const address = page
  .locator('div.flex.items-start.gap-4')
  .first()
  .locator('p');

await expect(address).toBeVisible({ timeout: 15000 });

// 3. ตรวจว่ามีเวลาเปิด-ปิด
const openingStatus = page.getByText(
  /^(เปิดให้บริการ|ปิดแล้ว)$/,
  { exact: true }
);

await expect(openingStatus).toBeVisible({ timeout: 15000 });

// 4. ตรวจว่ามีปุ่มค้นหาเส้นทาง
const navigationBtn = page.getByRole('button', {
  name: 'ค้นหาเส้นทาง'
});

await expect(navigationBtn).toBeVisible({ timeout: 15000 });

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_5_0_001_ViewPlaceDetail.png',
    fullPage: true
  });

  await context.close();
});