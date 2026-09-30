require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC_11_0_001 - ค้นหารายชื่อผู้ใช้งานสำเร็จ', async ({ browser }) => {

const context = await browser.newContext();
const page = await context.newPage();

 const keyword = 'vibemaptester@gmail.com';
  // =========================
  // 1. Login Admin
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');

  await page
    .getByPlaceholder('example@mail.com')
    .fill(process.env.MOOD_ADMIN_EMAIL);

  await page
    .locator('input[type="password"]')
    .fill(process.env.MOOD_ADMIN_PASSWORD);

  await page.click('button[type="submit"]');

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeHidden({
    timeout: 15000,
  });

  // =========================
  // 2. เปิดหน้าจัดการสมาชิก
  // =========================

  await page.getByRole('button', {
    name: 'จัดการสมาชิก',
  }).click();

  await expect(
    page.getByRole('heading', {
      name: /จัดการ สมาชิก/i,
    })
  ).toBeVisible();

  // =========================
  // 3. รอข้อมูลผู้ใช้โหลด
  // =========================

  const userRows = page.locator('table tbody tr');

  await expect(async () => {
    expect(await userRows.count()).toBeGreaterThan(0);
  }).toPass({
    timeout: 90000,
  });

  // =========================
  // 4. ค้นหาผู้ใช้
  // =========================

  const searchBox = page.getByRole('textbox', { name: 'ค้นหาชื่อ หรือ อีเมล' })
  await searchBox.fill(keyword);

  // =========================
  // 5. ตรวจสอบผลการค้นหา
  // =========================

  await expect(
    page.locator('table').getByRole('cell', {
      name: keyword,
    })
  ).toBeVisible({
    timeout: 30000,
  });

  // (Optional) ตรวจสอบว่าเหลือเพียง 1 รายการ
  await expect(async () => {
    expect(await userRows.count()).toBe(1);
  }).toPass({
    timeout: 30000,
  });

  // =========================
  // 6. Screenshot
  // =========================

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: 'evidence/TC_11_0_001_SearchUsersSuccess.png',
    fullPage: true,
  });

  await context.close();

});