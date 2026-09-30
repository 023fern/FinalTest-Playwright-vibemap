require('dotenv').config();
require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC_3_0_003 - ตรวจสอบการกรอกข้อความเป็นตัวเลข', async ({ browser }) => {

  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

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
  // 2. กรอกข้อความเป็นตัวเลข
  // =====================================================

  const aiInput = page.getByRole('textbox', {
    name: 'พิมพ์บอกความรู้สึกกับ AI...',
  });

  const inputData = '123456';

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
    'ข้อความไม่สามารถค้นหาได้ หรือไม่พบการค้นหาความรู้สึกนั้น (ไม่สามารถวิเคราะห์ตัวเลขได้)',
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

  await expect(okButton).toBeVisible();

  // =====================================================
  // 6. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_3_0_003_NumberInput.png',
    fullPage: true,
  });

  await context.close();
});