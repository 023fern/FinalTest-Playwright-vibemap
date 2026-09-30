require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC_1_0_012 - ผู้ใช้ที่ถูก Ban ไม่สามารถเข้าสู่ระบบได้', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =========================
  // Test Data
  // =========================

  const adminEmail = '664259023@webmail.npru.ac.th';
  const adminPassword = 'Bfxrn2547-';

  const userEmail = 'fernkk4@gmail.com';
  const userPassword = 'Bfxrn-2547';

  // =========================
  // 1. Login Admin
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('example@mail.com').fill(adminEmail);

  await page.locator('input[type="password"]').fill(adminPassword);

  await page.locator('button[type="submit"]').click();

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
  // 3. รอข้อมูลโหลด
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

  await page
    page.getByRole('textbox', { name: 'ค้นหาชื่อ หรือ อีเมล' })
    .fill(userEmail);

  const userRow = page
    .locator('tbody tr')
    .filter({
      has: page.getByRole('cell', {
        name: userEmail,
      }),
    });

  await expect(userRow).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 5. Ban User
  // =========================

  const banButton = userRow.locator('button').first();

  await expect(banButton).toBeEnabled();

  await banButton.click();

  await page.getByRole('button', {
    name: 'ตกลง',
  }).click();

  await expect(
    userRow.getByText('BANNED')
  ).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 6. Logout Admin
  // =========================

  await page.getByRole('button', {
    name: 'ออกจากระบบ',
  }).click();

  await page.getByRole('button', {
    name: 'ใช่, ออกจากระบบ',
  }).click();

  await expect(
    page.getByPlaceholder('example@mail.com')
  ).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 7. Login User
  // =========================

  await page.getByPlaceholder('example@mail.com').fill(userEmail);

  await page
    .locator('input[type="password"]')
    .fill(userPassword);

  await page.locator('button[type="submit"]').click();

  // =========================
  // 8. ตรวจสอบว่าเข้าสู่ระบบไม่ได้
  // =========================

  await expect(
    page.getByText(/บัญชี.*ระงับ|ถูกระงับ/i)
  ).toBeVisible({
    timeout: 30000,
  });

  await expect(
    page.getByPlaceholder('example@mail.com')
  ).toBeVisible();

  // =========================
  // 9. Screenshot
  // =========================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_1_0_012_BannedUser.png',
    fullPage: true,
  });

  await context.close();

});