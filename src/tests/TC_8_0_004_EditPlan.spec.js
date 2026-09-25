require('dotenv').config();
require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 8.0.004 - แก้ไขแผนการเดินทางสำเร็จ', async ({ browser }) => {
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
  // 1. Login
  // =====================================================

  await page.goto('https://moodlocation.vercel.app/login');

  await page
    .getByPlaceholder('example@mail.com')
    .fill(process.env.MOOD_EMAIL);

  await page
    .locator('input[type="password"]')
    .fill(process.env.MOOD_PASSWORD);

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

  await addActivityButton.click();

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

  await addActivityButton.click();

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
  // 7. เก็บข้อมูลเดิม
  // =====================================================

  const originalTripName = `Playwright Trip ${Date.now()}`;

  const tripNameInput = page.getByRole('textbox', {
    name: 'ชื่อทริปของคุณ',
  });

  await expect(tripNameInput).toBeVisible({
    timeout: 10000,
  });

  await tripNameInput.fill(originalTripName);

  const originalPlace1 = await page
    .getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 1',
      exact: true,
    })
    .locator('..')
    .getByRole('paragraph')
    .innerText();

  const originalPlace2 = await page
    .getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 2-',
      exact: true,
    })
    .locator('..')
    .getByRole('paragraph')
    .innerText();

  const originalPlace3 = await page
    .getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 3',
      exact: true,
    })
    .locator('..')
    .getByRole('paragraph')
    .innerText();

  console.log('ชื่อทริปเดิม:', originalTripName);
  console.log('กิจกรรมที่ 1 เดิม:', originalPlace1);
  console.log('กิจกรรมที่ 2 เดิม:', originalPlace2);
  console.log('กิจกรรมที่ 3 เดิม:', originalPlace3);

  // =====================================================
  // 8. บันทึกแพลนครั้งแรก
  // =====================================================

  await page.getByRole('button', {
    name: 'บันทึกแพลนเดินทาง',
  }).click();

  const successDialog = page.getByRole('dialog', {
    name: 'สำเร็จ!',
  });

  await expect(successDialog).toBeVisible({
    timeout: 10000,
  });

  await successDialog.getByRole('button', {
    name: 'OK',
  }).click();

  // =====================================================
  // 9. ตรวจสอบแพลนที่สร้างในประวัติ
  // =====================================================

  await expect(
    page.getByRole('heading', {
      name: 'ประวัติทริปของฉัน 🎒',
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });

  const tripCard = page.getByRole('heading', {
    level: 3,
    name: originalTripName,
    exact: true,
  });

  await expect(tripCard).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 10. กดการ์ดทริป
  // =====================================================

  await page.getByText(originalTripName, {
    exact: true,
  }).click();

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'แผนการเดินทาง 🗺️',
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 11. เปลี่ยนชื่อทริป
  // =====================================================

  const newTripName = `Playwright Edit Trip ${Date.now()}`;

  await expect(
    page.getByRole('textbox', {
      name: 'ชื่อทริปของคุณ',
    })
  ).toBeVisible({
    timeout: 10000,
  });

  await page.getByRole('textbox', {
    name: 'ชื่อทริปของคุณ',
  }).fill(newTripName);

  // =====================================================
  // 12. ลบสถานที่กิจกรรมที่ 1
  // =====================================================

  const deletePlaceButton = page.getByRole('button', {
    name: 'ลบสถานที่',
  }).first();

  await expect(deletePlaceButton).toBeVisible({
    timeout: 10000,
  });

  await deletePlaceButton.click();

  // =====================================================
  // 13. เพิ่มกิจกรรมใหม่
  // =====================================================

  await expect(addActivityButton).toBeVisible({
    timeout: 10000,
  });

  await addActivityButton.click();

  // =====================================================
  // 14. เลือกสถานที่ใหม่
  // =====================================================

  const selectButtons = page.getByRole('button', {
    name: 'เลือก',
  });

  await expect(selectButtons.first()).toBeVisible({
    timeout: 15000,
  });

  const selectCount = await selectButtons.count();

  let newPlaceSelected = false;
  let newPlaceName = '';

  for (let i = 0; i < selectCount; i++) {
    const card = selectButtons.nth(i).locator('..');
    const cardText = (await card.innerText()).trim();

    if (cardText && !cardText.includes(originalPlace1)) {
      const lines = cardText
        .split('\n')
        .map(text => text.trim())
        .filter(Boolean);

      newPlaceName = lines[0];

      await selectButtons.nth(i).click();

      newPlaceSelected = true;
      break;
    }
  }

  if (!newPlaceSelected) {
    throw new Error(
      'ไม่พบสถานที่ใหม่ที่แตกต่างจากสถานที่เดิม'
    );
  }

  console.log('สถานที่ใหม่:', newPlaceName);

  // =====================================================
  // 15. ตรวจสอบกิจกรรมครบ 3 รายการ
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
      name: 'กิจกรรมที่ 2-',
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
  // 16. บันทึกการแก้ไข
  // =====================================================

  await page.getByRole('button', {
    name: 'บันทึกแพลนเดินทาง',
  }).click();

  const editSuccessDialog = page.getByRole('dialog', {
    name: 'สำเร็จ!',
  });

  await expect(editSuccessDialog).toBeVisible({
    timeout: 10000,
  });

  await editSuccessDialog.getByRole('button', {
    name: 'OK',
  }).click();

  // =====================================================
  // 17. ตรวจสอบประวัติทริป
  // =====================================================

  await expect(
    page.getByRole('heading', {
      name: 'ประวัติทริปของฉัน 🎒',
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // ชื่อใหม่ต้องมี
  await expect(
    page.getByRole('heading', {
      level: 3,
      name: newTripName,
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // ชื่อเดิมต้องไม่มี
  await expect(
    page.getByRole('heading', {
      level: 3,
      name: originalTripName,
      exact: true,
    })
  ).not.toBeVisible({
    timeout: 10000,
  });

  // =====================================================
  // 18. เปิดแพลนที่แก้ไขแล้ว
  // =====================================================

  await page.getByText(newTripName, {
    exact: true,
  }).click();

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'แผนการเดินทาง 🗺️',
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 19. ตรวจสอบชื่อทริปใหม่
  // =====================================================

  const editedTripNameInput = page.getByRole('textbox', {
    name: 'ชื่อทริปของคุณ',
  });

  await expect(editedTripNameInput).toHaveValue(
    newTripName
  );

  await expect(editedTripNameInput).not.toHaveValue(
    originalTripName
  );

  // =====================================================
  // 20. ตรวจสอบสถานที่ที่แก้ไข
  // =====================================================

  const editedPlace1 = await page
    .getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 1',
      exact: true,
    })
    .locator('..')
    .getByRole('paragraph')
    .innerText();

  const editedPlace2 = await page
    .getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 2-',
      exact: true,
    })
    .locator('..')
    .getByRole('paragraph')
    .innerText();

  const editedPlace3 = await page
    .getByRole('heading', {
      level: 3,
      name: 'กิจกรรมที่ 3',
      exact: true,
    })
    .locator('..')
    .getByRole('paragraph')
    .innerText();

  console.log('สถานที่หลังแก้:', editedPlace1);
  console.log('กิจกรรมที่ 2 หลังแก้:', editedPlace2);
  console.log('กิจกรรมที่ 3 หลังแก้:', editedPlace3);

  // สถานที่ที่ 1 ต้องเปลี่ยน
  expect(editedPlace1).toBe(newPlaceName);
  expect(editedPlace1).not.toBe(originalPlace1);

  // สถานที่ที่ 2 และ 3 ต้องคงเดิม
  expect(editedPlace2).toBe(originalPlace2);
  expect(editedPlace3).toBe(originalPlace3);

  // =====================================================
  // 21. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_8_0_004_EditPlan.png',
    fullPage: true,
  });

  await context.close();
});