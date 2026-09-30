require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC_11_0_003 - ลบบัญชีผู้ใช้งานสำเร็จ', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =========================
  // Test Data
  // =========================

  const targetEmail = 'fernkk4@gmail.com';

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

//   await expect(
//     page.getByText('เข้าสู่ระบบสำเร็จ')
//   ).toBeHidden({
//     timeout: 15000,
//   });

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

  await page.getByRole('textbox', { name: 'ค้นหาชื่อ หรือ อีเมล' })
    .fill(targetEmail);

  const userRow = page
    .locator('tbody tr')
    .filter({
      has: page.getByRole('cell', {
        name: targetEmail,
      }),
    });

  await expect(userRow).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 5. กด Delete
  // =========================

  const deleteButton = userRow.locator('button').nth(1);

  await expect(deleteButton).toBeEnabled();

  await deleteButton.click();

  // =========================
  // 6. ตรวจสอบ Popup
  // =========================

  await expect(
    page.getByText('ลบสมาชิกถาวร?')
  ).toBeVisible();

  await expect(
    page.getByText(/DELETE/)
  ).toBeVisible();

  // =========================
  // 7. พิมพ์ DELETE
  // =========================

  await page
    .getByPlaceholder('พิมพ์ DELETE ที่นี่...')
    .fill('DELETE');

  // =========================
  // 8. ยืนยันการลบ
  // =========================

  await page.getByRole('button', {
    name: 'ยืนยันการลบ',
  }).click();

  // =========================
  // 9. รอ Toast (ถ้ามี)
  // =========================

  const toast = page.getByText(/สำเร็จ|ลบ/i);

  if (await toast.isVisible().catch(() => false)) {
    await expect(toast).toBeHidden({
      timeout: 10000,
    });
  }

  // =========================
  // 10. ตรวจสอบว่าผู้ใช้ถูกลบ
  // =========================

  await expect(userRow).toHaveCount(0, {
    timeout: 30000,
  });

  // หรือจะใช้แบบนี้แทนก็ได้
  // await expect(
  //   page.getByRole('cell', {
  //     name: targetEmail,
  //   })
  // ).toHaveCount(0);

  // =========================
  // 11. Screenshot
  // =========================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_11_0_003_DeleteUserSuccess.png',
    fullPage: true,
  });

  await context.close();

});