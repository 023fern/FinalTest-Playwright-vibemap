require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 7.0.004 - ตรวจสอบการเรียงลำดับประวัติการนำทาง', async ({ browser }) => {
  test.setTimeout(180000);

  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

  const visitedPlaces = [];

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

  await expect(
    page.getByRole('button', { name: /เศร้า/ })
  ).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 2. เลือกอารมณ์และหมวดหมู่ครั้งเดียว
  // =====================================================

  const emotionBtn = page.getByRole('button', {
    name: /เศร้า/,
  });

  await expect(emotionBtn).toBeVisible({
    timeout: 15000,
  });

  await emotionBtn.click();

  const categoryBtn = page.getByRole('heading', {
    level: 3,
    name: 'ริมแม่น้ำ',
    exact: true,
  });

  await expect(categoryBtn).toBeVisible({
    timeout: 15000,
  });

  await categoryBtn.click();

  // รอให้รายการสถานที่แสดง
  const viewButtons = page.getByRole('button', {
    name: 'ดูรูปภาพและรีวิว',
  });

  await expect(viewButtons.first()).toBeVisible({
    timeout: 20000,
  });

  const placeCount = await viewButtons.count();

  if (placeCount < 5) {
    throw new Error(
      `จำนวนสถานที่ไม่เพียงพอ: พบ ${placeCount} แห่ง ต้องมีอย่างน้อย 5 แห่ง`
    );
  }

  console.log(`พบสถานที่ทั้งหมด ${placeCount} แห่ง`);

  // =====================================================
  // 3. สร้างประวัติ 5 รายการ
  // =====================================================

  for (let i = 0; i < 5; i++) {

    console.log(`\n===== รอบที่ ${i + 1} =====`);

    // -----------------------------------------------------
    // เลือกสถานที่ลำดับที่ i
    // -----------------------------------------------------

    const currentViewButton = page.getByRole('button', {
      name: 'ดูรูปภาพและรีวิว',
    }).nth(i);

    await expect(currentViewButton).toBeVisible({
      timeout: 15000,
    });

    await currentViewButton.click();

    // -----------------------------------------------------
    // เก็บชื่อสถานที่
    // -----------------------------------------------------

    const placeHeading = page
      .getByRole('heading', { level: 1 })
      .first();

    await expect(placeHeading).toBeVisible({
      timeout: 15000,
    });

    const placeName = (
      await placeHeading.innerText()
    ).trim();

    console.log(`สถานที่: ${placeName}`);

    // ตรวจสอบว่าไม่ซ้ำ
    if (visitedPlaces.includes(placeName)) {
      throw new Error(
        `พบสถานที่ซ้ำ: ${placeName}`
      );
    }

    visitedPlaces.push(placeName);

    // -----------------------------------------------------
    // กดค้นหาเส้นทาง
    // -----------------------------------------------------

    const navigateBtn = page.getByRole('button', {
      name: 'ค้นหาเส้นทาง',
    });

    await expect(navigateBtn).toBeVisible({
      timeout: 15000,
    });

    // รอแท็บ Google Maps
    const newPagePromise = context
      .waitForEvent('page', { timeout: 10000 })
      .catch(() => null);

    await navigateBtn.click();

    const newPage = await newPagePromise;

    // ปิดแท็บ Maps ถ้ามี
    if (newPage) {
      await newPage
        .waitForLoadState('domcontentloaded')
        .catch(() => {});

      console.log(`เปิด Maps: ${newPage.url()}`);

      await newPage.close();
    }

    console.log(
      `บันทึกประวัติที่ ${visitedPlaces.length}: ${placeName}`
    );

    // -----------------------------------------------------
    // กลับหน้าผลการค้นหาเพื่อเลือกสถานที่ถัดไป
    // -----------------------------------------------------

    if (i < 4) {
      const backButton = page.locator('main button').first();

      await expect(backButton).toBeVisible({
        timeout: 10000,
      });

      await backButton.click();

      // รอหน้าผลการค้นหากลับมา
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: /ผลการค้นหา: ริมแม่น้ำ/,
        })
      ).toBeVisible({
        timeout: 15000,
      });

      // รอปุ่มรายการสถานที่
      await expect(
        page.getByRole('button', {
          name: 'ดูรูปภาพและรีวิว',
        }).nth(i + 1)
      ).toBeVisible({
        timeout: 15000,
      });

      console.log('กลับหน้ารายการสถานที่สำเร็จ');
    }
  }

  // =====================================================
  // 4. เปิดเมนูประวัติการนำทาง
  // =====================================================

  const hamburgerMenu = page.locator('.hamburger-icon');

  await expect(hamburgerMenu).toBeVisible({
    timeout: 15000,
  });

  await hamburgerMenu.click();

  const historyMenuText = page.getByText(
    'ประวัติการนำทาง',
    { exact: true }
  );

  await expect(historyMenuText).toBeVisible({
    timeout: 10000,
  });

  await historyMenuText.click();

  // =====================================================
  // 5. ตรวจสอบ History
  // =====================================================

  const historyHeading = page.getByRole('heading', {
    name: 'ประวัติการนำทาง',
  });

  await expect(historyHeading).toBeVisible({
    timeout: 15000,
  });

  const expectedOrder = [...visitedPlaces].reverse();

  console.log('\nลำดับที่กดค้นหาเส้นทาง:');
  console.log(visitedPlaces);

  console.log('\nลำดับที่คาดหวังใน History:');
  console.log(expectedOrder);

  await expect.poll(
    async () => {
      const historyItems = page.locator('main h3:visible');

      const historyNames = (
        await historyItems.allTextContents()
      )
        .map(text => text.trim())
        .filter(Boolean);

      return historyNames.slice(0, 5);
    },
    {
      timeout: 30000,
      intervals: [500, 1000, 2000],
    }
  ).toEqual(expectedOrder);

  // =====================================================
  // 6. แคปหลักฐาน
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_7_0_004_HistorySorting.png',
    fullPage: true,
  });

  await context.close();
});