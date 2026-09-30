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

  const userFeeling = 'วันนี้ปวดขามากเดินเยอะ';

  const aiInput = page.getByRole('textbox', {
    name: 'พิมพ์บอกความรู้สึกกับ AI...',
  });

  await aiInput.fill(userFeeling);

  await expect(aiInput).toHaveValue(userFeeling);

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
// 4. ตรวจสอบผลการวิเคราะห์อารมณ์
// =====================================================

await expect(
  page.getByText('สิ่งที่วิเคราะห์ได้', {
    exact: true,
  })
).toBeVisible({
  timeout: 90000,
});

await expect(
  page.getByText('เหตุผล', {
    exact: true,
  })
).toBeVisible({
  timeout: 90000,
});

await expect(
  page.getByText('สถานที่ที่แนะนำ', {
    exact: true,
  })
).toBeVisible({
  timeout: 90000,
});
  // =====================================================
  // 5. ตรวจสอบว่ามีการ์ดสถานที่แนะนำ
  // =====================================================

  const placeCards = page
    .getByRole('button', {
      name: 'ดูรูปภาพและรีวิว',
    });

  await expect(
    placeCards.first()
  ).toBeVisible({
    timeout: 90000,
  });

  const placeCount = await placeCards.count();

  expect(placeCount).toBeGreaterThan(0);

  console.log(
    `ระบบแสดงสถานที่แนะนำจำนวน ${placeCount} แห่ง`
  );

  // ตรวจว่าชื่อสถานที่มีการแสดงผล โดยไม่กำหนดชื่อเฉพาะ
  const placeCardTitle = page
    .locator('main h3:visible')
    .first();

  await expect(placeCardTitle).toBeVisible({
    timeout: 90000,
  });

  console.log(
    'สถานที่แนะนำ:',
    await placeCardTitle.innerText()
  );

  // =====================================================
  // 6. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_3_0_001_EmotionAnalyzeSuccess.png',
    fullPage: true,
  });

  console.log('Screenshot saved');

  await context.close();

  console.log('=== Test Finished ===');
});