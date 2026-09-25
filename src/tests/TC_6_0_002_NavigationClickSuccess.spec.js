require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 6.0.002 - เริ่มการนำทางไปยังสถานที่สำเร็จ', async ({ browser }) => {
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

// รอให้ชื่อสถานที่โหลดเสร็จ
await expect(page.locator('main h1')).not.toHaveText('กำลังโหลดข้อมูลร้าน...');

// เก็บชื่อสถานที่
const placeName = (
  await page.locator('main h1').textContent()
)?.trim();

// กดปุ่มนำทางและรอแท็บใหม่
const navigationButton = page.getByRole('button', {
  name: 'เริ่มการนำทางไปที่นี่'
});

const [mapsPage] = await Promise.all([
  context.waitForEvent('page'),
  navigationButton.click()
]);

await mapsPage.waitForLoadState();

// ตรวจสอบว่าเปิด Google Maps
await expect(mapsPage).toHaveURL(/google\.[^/]+\/maps|maps/i);

// ตรวจสอบว่าชื่อสถานที่ตรงกับหน้าเว็บ
await expect(mapsPage).toHaveTitle(new RegExp(placeName, 'i'));

  await mapsPage.screenshot({
    path: 'evidence/TC_6_0_002_NavigationSuccess.png',
    fullPage: true
  });

  await context.close();
});