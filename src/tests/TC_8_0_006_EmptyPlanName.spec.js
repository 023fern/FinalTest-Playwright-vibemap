require('dotenv').config();
require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test('TC 8.0.006 - ไม่กรอกชื่อแผน', async ({ browser }) => {
  test.setTimeout(180000);

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
  // 2. เปิดเมนูวางแผนการเดินทาง
  // =====================================================

  const hamburgerMenu = page.locator('.hamburger-icon');

  await hamburgerMenu.click();

  const planMenu = page.getByText(
    'วางแผนการเดินทาง',
    { exact: true }
  );

  await expect(planMenu).toBeVisible({
    timeout: 10000,
  });

  await planMenu.click();

  // =====================================================
  // 3. สร้างแพลนใหม่
  // =====================================================

  const createPlanButton = page.getByRole('button', {
    name: 'สร้างแพลนใหม่เลย',
  });

  await expect(createPlanButton).toBeVisible({
    timeout: 15000,
  });

  await createPlanButton.click();

  // =====================================================
  // 4. เพิ่มกิจกรรมที่ 1
  // =====================================================

  const addActivityButton = page.getByRole('button', {
    name: 'เพิ่มกิจกรรม',
  }).first();

  await expect(addActivityButton).toBeVisible({
    timeout: 15000,
  });

  await addActivityButton.click();

  await expect(
    page.getByRole('button', {
      name: 'เลือก',
    }).nth(0)
  ).toBeVisible({
    timeout: 15000,
  });

  await page.getByRole('button', {
    name: 'เลือก',
  }).nth(0).click();

  // =====================================================
  // 5. เพิ่มกิจกรรมที่ 2
  // =====================================================

  // await expect(addActivityButton).toBeVisible({
  //   timeout: 15000,
  // });

  await page.getByRole('button', { name: 'เพิ่มกิจกรรม' }).nth(1).click();

  await expect(
    page.getByRole('button', {
      name: 'เลือก',
    }).nth(1)
  ).toBeVisible({
    timeout: 15000,
  });

  await page.getByRole('button', {
    name: 'เลือก',
  }).nth(1).click();

  // =====================================================
  // 6. เพิ่มกิจกรรมที่ 3
  // =====================================================

  // await expect(addActivityButton).toBeVisible({
  //   timeout: 15000,
  // });

  await page.getByRole('button', { name: 'เพิ่มกิจกรรม' }).nth(2).click();

  await expect(
    page.getByRole('button', {
      name: 'เลือก',
    }).nth(2)
  ).toBeVisible({
    timeout: 15000,
  });

  await page.getByRole('button', {
    name: 'เลือก',
  }).nth(2).click();

  // =====================================================
  // 7. ตรวจสอบว่ามีกิจกรรมครบ 3 รายการ
  // =====================================================

  await expect(
    page.getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 1',
      exact: true,
    })
  ).toBeVisible({
    timeout: 10000,
  });

  await expect(
    page.getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 2',
      exact: true,
    })
  ).toBeVisible({
    timeout: 10000,
  });

  await expect(
    page.getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 3',
      exact: true,
    })
  ).toBeVisible({
    timeout: 10000,
  });

  // =====================================================
  // 8. ตรวจสอบช่องชื่อทริปว่าง
  // =====================================================

  const tripNameInput = page.getByRole('textbox', {
    name: 'ชื่อทริปของคุณ',
  });

  await expect(tripNameInput).toBeVisible({
    timeout: 10000,
  });

  await expect(tripNameInput).toHaveValue('');

  // =====================================================
  // 9. กดบันทึกโดยไม่กรอกชื่อแผน
  // =====================================================

  const savePlanButton = page.getByRole('button', {
    name: 'บันทึกแพลนเดินทาง',
  });

  await expect(savePlanButton).toBeVisible({
    timeout: 10000,
  });

  await savePlanButton.click();

// =====================================================
// 10. ตรวจสอบข้อความแจ้งเตือน
// =====================================================

const incompleteDialog = page.getByRole('dialog', {
  name: 'ข้อมูลไม่ครบ',
});

await expect(incompleteDialog).toBeVisible({
  timeout: 10000,
});

await expect(
  incompleteDialog.getByText(
    'กรุณาตั้งชื่อทริปของคุณ',
    { exact: true }
  )
).toBeVisible({
  timeout: 10000,
});

// ตรวจสอบปุ่ม OK
const okButton = incompleteDialog.getByRole('button', {
  name: 'OK',
});

await expect(okButton).toBeVisible({
  timeout: 10000,
});

  // =====================================================
  // 11. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_8_0_006_EmptyPlanName.png',
    fullPage: true,
  });

  await context.close();
});