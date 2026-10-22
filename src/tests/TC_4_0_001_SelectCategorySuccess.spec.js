require('dotenv').config();

require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test('TC_4_0_001 - เลือกหมวดหมู่สถานที่สำเร็จ', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });
  const page = await context.newPage();

  // =====================================================
  // Mock Geolocation
  // =====================================================
  await page.addInitScript(() => {
    const mockPosition = {
      coords: {
        latitude: 13.7563,
        longitude: 100.5018,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    navigator.geolocation.getCurrentPosition = (success) => {
      success(mockPosition);
    };

    navigator.geolocation.watchPosition = (success) => {
      success(mockPosition);
      return 1;
    };

    navigator.geolocation.clearWatch = () => {};
  });

  // =====================================================
  // 1. Login
  // =====================================================
  await page.goto('https://moodlocation.vercel.app/login');
  await page
    .getByPlaceholder('example@mail.com')
    .fill(process.env.MOOD_USER_EMAIL);
  await page
    .locator('input[type="password"]')
    .fill(process.env.MOOD_USER_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(
    page.locator('.hamburger-icon')
  ).toBeVisible({
    timeout: 15000,
  });
  // =====================================================
  // 2. เลือกอารมณ์
  // =====================================================
  const emotionButton = page.getByRole('button', {
    name: /เศร้า/,
  });
  await expect(emotionButton).toBeVisible({
    timeout: 15000,
  });
  await emotionButton.click();
  // =====================================================
  // 3. เลือกหมวดหมู่สถานที่
  // =====================================================
  const categoryButton = page.getByRole('heading', {
    level: 3,
    name: 'ริมแม่น้ำ',
    exact: true,
  });
  await expect(categoryButton).toBeVisible({
    timeout: 15000,
  });
  await categoryButton.click();
  // =====================================================
  // 4. ตรวจสอบผลการค้นหาตามหมวดหมู่ที่เลือก
  // =====================================================
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'ผลการค้นหา: ริมแม่น้ำ',
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });
  // =====================================================
  // 5. ตรวจสอบว่าระบบแสดงรายการสถานที่
  // =====================================================
  const placeCards = page.getByRole('button', {
    name: 'ดูรูปภาพและรีวิว',
  });
  await expect(placeCards.first()).toBeVisible({
    timeout: 30000,
  });
  const placeCount = await placeCards.count();
  expect(placeCount).toBeGreaterThan(0);
  console.log(
    `ระบบแสดงรายการสถานที่ในหมวดริมแม่น้ำจำนวน ${placeCount} แห่ง`
  );
  // =====================================================
  // 6. Screenshot
  // =====================================================
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: 'evidence/TC_4_0_001_SelectCategorySuccess.png',
    fullPage: true,
  });
  await context.close();
});
