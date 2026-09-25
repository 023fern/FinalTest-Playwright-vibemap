require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 7.0.001 - แสดงประวัติการนำทางสำเร็จ', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

  // 1. เข้าสู่ระบบ
  await page.goto('https://moodlocation.vercel.app/login');

  await page
    .getByPlaceholder('example@mail.com')
    .fill('vibemaptester@gmail.com');

  await page
    .locator('input[type="password"]')
    .fill('Bfxrn2547-');

  await page.click('button[type="submit"]');

  // รอจนเข้าสู่หน้าหลักหลัง Login
  const emotionBtn = page.getByRole('button', { name: /เศร้า/ });

  await expect(emotionBtn).toBeVisible({ timeout: 15000 });

  // 2. เลือกความรู้สึก "เศร้า"
  await emotionBtn.click();

  // 3. เลือกหมวดหมู่ "สวนสาธารณะ"
  const categoryBtn = page.getByRole('heading', {
    name: 'สวนสาธารณะ',
  });

  await expect(categoryBtn).toBeVisible({ timeout: 15000 });
  await categoryBtn.click();

  // 4. เปิดรายละเอียดสถานที่
  const viewButton = page.getByRole('button', {
    name: 'ดูรูปภาพและรีวิว',
  }).first();

  await expect(viewButton).toBeVisible({ timeout: 20000 });
  await viewButton.click();

  // 5. กดค้นหาเส้นทาง
  const navigateBtn = page.getByRole('button', {
    name: 'ค้นหาเส้นทาง',
  });

  await expect(navigateBtn).toBeVisible({ timeout: 15000 });

  // รองรับกรณีเปิด Maps เป็นแท็บใหม่
  const newPagePromise = context
    .waitForEvent('page', { timeout: 10000 })
    .catch(() => null);

  await navigateBtn.click();

  const newPage = await newPagePromise;

  if (newPage) {
    await newPage.waitForLoadState('domcontentloaded').catch(() => {});
    console.log('เปิดหน้า Maps:', newPage.url());
    await newPage.close();
  }

  // 6. เปิดเมนู
  const hamburgerMenu = page.locator('.hamburger-icon');

  await expect(hamburgerMenu).toBeVisible({ timeout: 10000 });
  await hamburgerMenu.click();

  // 7. เลือก "ประวัติการนำทาง"
  const historyMenuText = page.getByText('ประวัติการนำทาง', {
    exact: true,
  });

  await expect(historyMenuText).toBeVisible({ timeout: 10000 });
  await historyMenuText.click();
  
console.log('URL หลังคลิก:', page.url());

await page.waitForTimeout(5000);
  // 8. ตรวจสอบว่าหน้าประวัติแสดง
  const historyHeading = page.getByRole('heading', {
    name: 'ประวัติการนำทาง',
  });

await expect(historyHeading).toBeVisible({
  timeout: 60000,
});

  // แคปหลักฐาน
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_7_0_001_HistorySuccess.png',
    fullPage: true,
  });

  await context.close();
});