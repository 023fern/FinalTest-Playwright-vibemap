require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC 3.0.001 - วิเคราะห์อารมณ์จากข้อความสำเร็จ', async ({ browser }) => {

  console.log('=== Start Test ===');

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
    .fill('vibemaptester@gmail.com');

  await page
    .locator('input[type="password"]')
    .fill('Bfxrn2547-');

  await page.click('button[type="submit"]');

  console.log('Login button clicked');

  // รอหน้า Home หลัง Login
  await expect(
    page.getByRole('textbox', {
      name: 'พิมพ์บอกความรู้สึกกับ AI...',
    })
  ).toBeVisible({
    timeout: 15000,
  });

  console.log('Login success');

  // =====================================================
  // 2. กรอกข้อความให้ AI วิเคราะห์
  // =====================================================

  const aiInput = page.getByRole('textbox', {
    name: 'พิมพ์บอกความรู้สึกกับ AI...',
  });

  await aiInput.fill('ง่วงจัง');

  await expect(aiInput).toHaveValue('ง่วงจัง');

  // =====================================================
  // 3. กดค้นหา
  // =====================================================

  const searchBtn = page.getByRole('button', {
    name: /ค้นหา/i,
  });

  await expect(searchBtn).toBeVisible({
    timeout: 10000,
  });

  await searchBtn.click();

  // =====================================================
  // 4. ตรวจสอบการ์ดสถานที่
  // =====================================================

  const placeCardTitle = page
    .locator('main h3:visible')
    .first();

  await expect(placeCardTitle).toBeVisible({
    timeout: 90000,
  });

  console.log(
    'Place card loaded:',
    await placeCardTitle.innerText()
  );

  // =====================================================
  // 5. Screenshot
  // =====================================================

  await page.screenshot({
    path: 'evidence/TC_3_0_001_EmotionAnalyzeSuccess.png',
    fullPage: true,
  });

  console.log('Screenshot saved');

  await context.close();

  console.log('=== Test Finished ===');
});