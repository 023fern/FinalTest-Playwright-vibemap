require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 9.0.001 - ค้นหาสถานที่และเริ่มการนำทาง', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });
  const page = await context.newPage();

  // 1. เข้าสู่ระบบ
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('fernkk4@gmail.com');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // 2. เลือกความรู้สึก "เศร้า"
  const emotionBtn = page.locator('button').filter({ hasText: 'เศร้า' }).filter({ visible: true }).first();
  await emotionBtn.waitFor({ state: 'visible' });
  await emotionBtn.click();

  // 3. เลือกหมวดหมู่ "สวนสาธารณะ" และรอโหลดหน้าผลการค้นหา
  const categoryBtn = page.locator('button, h1, h2, h3, h4, h5, h6').filter({ hasText: 'สวนสาธารณะ' }).first();
  await categoryBtn.waitFor({ state: 'visible', timeout: 15000 });
  await categoryBtn.click();
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');

  // 4. ดูรูปภาพและรีวิวของสถานที่แรก
  const viewButton = page.getByRole('button', { name: 'ดูรูปภาพและรีวิว' }).first();
  await viewButton.waitFor({ state: 'visible', timeout: 20000 });
  await viewButton.click();
  await page.waitForLoadState('load');

  // 5. กดนำทาง และปิดแท็บ Google Maps ที่เด้งขึ้นมาใหม่
  const navigateBtn = page.getByRole('button', { name: 'เริ่มการนำทางไปที่นี่' }).first();
  await navigateBtn.waitFor({ state: 'visible', timeout: 15000 });

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    navigateBtn.click()
  ]);

  await newPage.waitForLoadState('load');
  console.log('เปิดหน้า Maps สำเร็จ:', newPage.url());
  await newPage.close(); 
  
  // 6. เปิดเมนูขีดสามขีด
  const hamburgerMenu = page.locator('.hamburger-icon');
  await hamburgerMenu.waitFor({ state: 'visible', timeout: 10000 });
  await hamburgerMenu.click(); 

  // 7. คลิกเลือกเมนู "ประวัติการนำทาง"
  const historyMenuText = page.getByText('ประวัติการนำทาง');
  await historyMenuText.waitFor({ state: 'visible', timeout: 5000 });
  await historyMenuText.click(); 
  await page.waitForLoadState('networkidle');

  // 8. ตรวจสอบหน้าจอประวัติ ปรับขนาดจอ และแคปภาพหลักฐาน
  const historyHeading = page.getByRole('heading', { name: 'ประวัติการนำทาง' });
  await historyHeading.waitFor({ state: 'visible', timeout: 5000 });
  
  await page.setViewportSize({ width: 1024, height: 1800 });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'evidence/TC_9_0_001_HistorySuccess.spec.png' });

  await context.close();
});