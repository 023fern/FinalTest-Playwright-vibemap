require('dotenv').config();
require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC_3_0_001 - วิเคราะห์อารมณ์จากข้อความสำเร็จ', async ({ browser }) => {
  test.setTimeout(120000);

  // =====================================================
  // สร้าง Browser Context
  // =====================================================
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

  try {
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

      navigator.geolocation.getCurrentPosition = (
        success,
        error
      ) => {
        console.log('MOCK GEOLOCATION CALLED');
        success(mockPosition);
      };

      navigator.geolocation.watchPosition = (
        success,
        error
      ) => {
        console.log('MOCK GEOLOCATION WATCH CALLED');
        success(mockPosition);
        return 1;
      };

      navigator.geolocation.clearWatch = () => {};
    });

    // =====================================================
    // 1. เปิดเว็บไซต์
    // =====================================================
    await page.goto('https://moodlocation.vercel.app/login', {
      waitUntil: 'domcontentloaded',
    });

    console.log('เปิดเว็บไซต์สำเร็จ');

    // =====================================================
    // 2. Login
    // =====================================================
    await page.getByPlaceholder('example@mail.com')
      .fill('vibemaptester@gmail.com');

    await page.locator('input[type="password"]')
      .fill(process.env.MOOD_USER_PASSWORD);

    await page.locator('button[type="submit"]').click();

    // =====================================================
    // 3. รอช่อง AI
    // =====================================================
    const aiInput = page.getByRole('textbox', {
      name: 'พิมพ์บอกความรู้สึกกับ AI...',
    });

    await expect(aiInput).toBeVisible({
      timeout: 15000,
    });

    console.log('Login success');

    // =====================================================
    // 4. พิมพ์ความรู้สึก
    // =====================================================
    const userFeeling = 'หวังว่าฉันจะมีความสุขในวันนี้';

    await aiInput.fill(userFeeling);

    await expect(aiInput).toHaveValue(userFeeling);

    console.log('กรอกข้อความความรู้สึกสำเร็จ');

    // =====================================================
    // 5. กดค้นหา
    // =====================================================
    const searchBtn = page.getByRole('button', {
      name: /ค้นหา/i,
    });

    await expect(searchBtn).toBeVisible({
      timeout: 10000,
    });

    await searchBtn.click();

    console.log('Search clicked');

    // =====================================================
    // 6. รอผลการวิเคราะห์อารมณ์
    // =====================================================
    await expect(
      page.getByText('อารมณ์ที่วิเคราะห์ได้', {
        exact: true,
      })
    ).toBeVisible({
      timeout: 90000,
    });

    console.log('ระบบวิเคราะห์อารมณ์สำเร็จ');

    // =====================================================
    // 7. ตรวจสอบผลการวิเคราะห์
    // =====================================================
    await expect(
      page.getByText('เหตุผล', {
        exact: true,
      })
    ).toBeVisible({
      timeout: 15000,
    });

    console.log('แสดงเหตุผลของการวิเคราะห์สำเร็จ');

    // =====================================================
    // 8. ตรวจสอบสถานที่แนะนำ
    // =====================================================
    const placeCards = page.getByRole('button', {
      name: 'ดูรูปภาพและรีวิว',
    });

    // ต้องมีสถานที่แนะนำอย่างน้อย 1 รายการ
    const placeCount = await placeCards.count();

    expect(placeCount).toBeGreaterThanOrEqual(1);

    console.log(
      `ระบบแสดงสถานที่แนะนำจำนวน ${placeCount} แห่ง`
    );

    // ตรวจสอบว่าสถานที่รายการแรกแสดงผล
    await expect(placeCards.first()).toBeVisible({
      timeout: 30000,
    });

    // ตรวจสอบชื่อสถานที่
    const placeCardTitle = page
      .locator('main h3:visible')
      .first();

    await expect(placeCardTitle).toBeVisible({
      timeout: 15000,
    });

    console.log(
      'สถานที่แนะนำ:',
      await placeCardTitle.innerText()
    );

    // =====================================================
    // 9. Screenshot หลักฐาน
    // =====================================================
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    await page.screenshot({
      path: 'evidence/TC_3_0_001_EmotionAnalyzeSuccess.png',
      fullPage: true,
    });

    console.log('Screenshot saved');

    // =====================================================
    // 10. ย้อนกลับ
    // =====================================================
    const backButton = page.getByRole('button', {
      name: 'ย้อนกลับ',
    });

    await expect(backButton).toBeVisible({
      timeout: 15000,
    });

    await backButton.click();

    console.log('ย้อนกลับสำเร็จ');

    console.log('=== Test Finished ===');

  } finally {
    // =====================================================
    // ปิด Browser Context
    // =====================================================
    await context.close();
  }
});