require('dotenv').config();

require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test('TC_4_0_002 - เปลี่ยนหมวดหมู่และแสดงผลลัพธ์ใหม่', async ({ browser }) => {
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
  // 3. เลือกหมวดหมู่แรก "ริมแม่น้ำ"
  // =====================================================
  const firstCategory = page.getByRole('heading', {
    level: 3,
    name: 'ริมแม่น้ำ',
    exact: true,
  });
  await expect(firstCategory).toBeVisible({
    timeout: 15000,
  });
  await firstCategory.click();
  // =====================================================
  // 4. ตรวจสอบผลลัพธ์หมวดแรก
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
  const firstPlaceCards = page.getByRole('button', {
    name: 'ดูรูปภาพและรีวิว',
  });
  await expect(firstPlaceCards.first()).toBeVisible({
    timeout: 30000,
  });
  const firstPlaceCount = await firstPlaceCards.count();
  expect(firstPlaceCount).toBeGreaterThan(0);
  console.log(`หมวดแรก ริมแม่น้ำ พบ ${firstPlaceCount} แห่ง`);
  // =====================================================
  // 5. กลับไปเลือกหมวดหมู่ใหม่
  // =====================================================
  const backToCategoryButton = page.getByRole('button', {
    name: 'กลับไปเลือกประเภทใหม่',
  });
  await expect(backToCategoryButton).toBeVisible({
    timeout: 15000,
  });
  await backToCategoryButton.click();
  // =====================================================
  // 6. เลือกหมวดหมู่ใหม่ "สวนสาธารณะ"
  // =====================================================
  const secondCategory = page.getByRole('heading', {
    level: 3,
    name: 'สวนสาธารณะ',
    exact: true,
  });
  await expect(secondCategory).toBeVisible({
    timeout: 15000,
  });
  await secondCategory.click();
  // =====================================================
  // 7. ตรวจสอบผลลัพธ์หมวดใหม่
  // =====================================================
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'ผลการค้นหา: สวนสาธารณะ',
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });
  const secondPlaceCards = page.getByRole('button', {
    name: 'ดูรูปภาพและรีวิว',
  });
  await expect(secondPlaceCards.first()).toBeVisible({
    timeout: 30000,
  });
  const secondPlaceCount = await secondPlaceCards.count();
  expect(secondPlaceCount).toBeGreaterThan(0);
  console.log(`หมวดใหม่ สวนสาธารณะ พบ ${secondPlaceCount} แห่ง`);
  // =====================================================
  // 8. Screenshot
  // =====================================================
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: 'evidence/TC_4_0_002_ChangeCategory.png',
    fullPage: true,
  });
  await context.close();
});
