require('dotenv').config();
require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 8.0.003 - ลบแผนการเดินทางสำเร็จ', async ({ browser }) => {
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
    page.getByRole('button', { name: 'เลือก' }).nth(0)
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

  const tripName = `Playwright Delete Trip ${Date.now()}`;

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
  // 12. ตรวจสอบว่ากลับหน้าประวัติทริป
  // =====================================================

  await expect(
    page.getByRole('heading', {
      name: 'ประวัติทริปของฉัน 🎒',
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 13. ตรวจสอบว่าแพลนที่สร้างมีอยู่
  // =====================================================

  const savedTrip = page.getByRole('heading', {
    level: 3,
    name: tripName,
    exact: true,
  });

  await expect(savedTrip).toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 14. กดปุ่มลบทริป
  // =====================================================

  const deleteButton = page
    .getByRole('main')
    .getByRole('button')
    .filter({ hasText: /^$/ })
    .first();

  await expect(deleteButton).toBeVisible({
    timeout: 10000,
  });

  await deleteButton.click();

  // =====================================================
  // 15. ตรวจสอบ Dialog ยืนยันการลบ
  // =====================================================

  const deleteDialog = page.getByRole('dialog');

  await expect(deleteDialog).toBeVisible({
    timeout: 10000,
  });

  await expect(
    deleteDialog.getByText(
      'ลบทริปนี้?',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    deleteDialog.getByText(
      'คุณต้องการลบทริปนี้ใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนได้',
      { exact: true }
    )
  ).toBeVisible();

  // =====================================================
  // 16. กด "ลบเลย"
  // =====================================================

  await deleteDialog.getByRole('button', {
    name: 'ลบเลย',
  }).click();

  // =====================================================
  // 17. ตรวจสอบว่าแพลนถูกลบออกจากประวัติ
  // =====================================================

  await expect(savedTrip).not.toBeVisible({
    timeout: 15000,
  });

  // =====================================================
  // 18. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_8_0_003_DeletePlan.png',
    fullPage: true,
  });

  await context.close();
});