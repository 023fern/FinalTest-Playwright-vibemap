require('dotenv').config();
require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 8.0.002 - การดูแผนการเดินทางสำเร็จ', async ({ browser }) => {
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
    page.getByRole('button', { name: 'เลือก' }).first()
  ).toBeVisible({
    timeout: 15000,
  });

  await page.getByRole('button', {
    name: 'เลือก',
  }).nth(0).click();

  // =====================================================
  // 5. เพิ่มกิจกรรมที่ 2
  // =====================================================

  await expect(addActivityButton).toBeVisible({
    timeout: 15000,
  });

  await addActivityButton.click();

  await expect(
    page.getByRole('button', { name: 'เลือก' }).nth(1)
  ).toBeVisible({
    timeout: 15000,
  });

  await page.getByRole('button', {
    name: 'เลือก',
  }).nth(1).click();

  // =====================================================
  // 6. เพิ่มกิจกรรมที่ 3
  // =====================================================

  await expect(addActivityButton).toBeVisible({
    timeout: 15000,
  });

  await addActivityButton.click();

  await expect(
    page.getByRole('button', { name: 'เลือก' }).nth(2)
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
  // 8. ตั้งชื่อทริป
  // =====================================================

  const tripName = `Playwright Trip ${Date.now()}`;

  const tripNameInput = page.getByRole('textbox', {
    name: 'ชื่อทริปของคุณ',
  });

  await expect(tripNameInput).toBeVisible({
    timeout: 10000,
  });

  await tripNameInput.fill(tripName);

  // =====================================================
  // 9. บันทึกแพลน
  // =====================================================

  const savePlanButton = page.getByRole('button', {
    name: 'บันทึกแพลนเดินทาง',
  });

  await expect(savePlanButton).toBeVisible({
    timeout: 10000,
  });

  await savePlanButton.click();

  // =====================================================
  // 10. ตรวจสอบบันทึกสำเร็จ
  // =====================================================

  const successDialog = page.getByRole('dialog', {
    name: 'สำเร็จ!',
  });

  await expect(successDialog).toBeVisible({
    timeout: 10000,
  });

  await expect(
    successDialog.getByText(
      'บันทึกแพลนเดินทางเรียบร้อยแล้ว',
      { exact: true }
    )
  ).toBeVisible({
    timeout: 10000,
  });

// =====================================================
// 11. กด OK
// =====================================================

await successDialog.getByRole('button', {
  name: 'OK',
}).click();

// =====================================================
// 12. ตรวจสอบหน้าประวัติทริป
// =====================================================

await expect(
  page.getByRole('heading', {
    name: 'ประวัติทริปของฉัน 🎒',
    exact: true,
  })
).toBeVisible({
  timeout: 15000,
});

// ตรวจสอบชื่อทริปที่เพิ่งสร้าง
const savedTrip = page.getByRole('heading', {
  level: 3,
  name: tripName,
  exact: true,
});

await expect(savedTrip).toBeVisible({
  timeout: 15000,
});

// =====================================================
// 13. เปิดดูแพลน
// =====================================================

await savedTrip.click();

// =====================================================
// 14. ตรวจสอบหน้าแผนการเดินทาง
// =====================================================

await expect(
  page.getByRole('heading', {
    level: 1,
    name: 'แผนการเดินทาง 🗺️',
    exact: true,
  })
).toBeVisible({
  timeout: 15000,
});

await expect(
  page.getByRole('button', {
    name: 'กลับไปหน้าประวัติ',
  })
).toBeVisible({
  timeout: 10000,
});

// =====================================================
// 15. ตรวจสอบชื่อทริป
// =====================================================

await expect(
  page.getByRole('textbox', {
    name: 'ชื่อทริปของคุณ',
  })
).toHaveValue(tripName);

// =====================================================
// 16. ตรวจสอบกิจกรรม
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
// 17. Screenshot
// =====================================================

await page.evaluate(() => {
  window.scrollTo(0, 0);
});

await page.screenshot({
  path: 'evidence/TC_8_0_002_ViewPlan.png',
  fullPage: true,
});
});