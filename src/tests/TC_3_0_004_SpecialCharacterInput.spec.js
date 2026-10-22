require('dotenv').config();

require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test('TC_3_0_004 - ตรวจสอบข้อความที่มีอักขระพิเศษ', async ({ browser }) => {

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

  // รอหน้า Home
  await expect(
    page.getByRole('textbox', {
      name: 'พิมพ์บอกความรู้สึกกับ AI...',
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 2. กรอกข้อความที่มีอักขระพิเศษ
  // =====================================================
  const aiInput = page.getByRole('textbox', {
    name: 'พิมพ์บอกความรู้สึกกับ AI...',
  });

  const inputData = '!!!@@@###$$$';

  await aiInput.fill(inputData);

  await expect(aiInput).toHaveValue(inputData);

  // =====================================================
  // 3. กดค้นหา
  // =====================================================
  const searchButton = page.getByRole('button', {
    name: 'ค้นหา',
  });

  await expect(searchButton).toBeVisible({
    timeout: 10000,
  });

  await searchButton.click();

  // =====================================================
  // 4. ตรวจสอบข้อความแจ้งเตือน
  // =====================================================
  const alertDialog = page.getByRole('dialog', {
    name: 'แจ้งเตือน',
  });

  await expect(alertDialog).toBeVisible({
    timeout: 30000,
  });

  await expect(
    alertDialog.getByText(
      'ข้อความไม่สามารถค้นหาได้ หรือไม่พบการค้นหาความรู้สึกนั้น (ตัวเลขและสัญลักษณ์ไม่สื่อถึงอารมณ์)',
      { exact: true }
    )
  ).toBeVisible({
    timeout: 10000,
  });

  // =====================================================
  // 5. ตรวจสอบปุ่ม OK
  // =====================================================
  const okButton = alertDialog.getByRole('button', {
    name: 'OK',
  });

  await expect(okButton).toBeVisible({
    timeout: 10000,
  });

  // =====================================================
  // 6. Screenshot
  // =====================================================
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_3_0_004_SpecialCharacterInput.png',
    fullPage: true,
  });

  await context.close();
});