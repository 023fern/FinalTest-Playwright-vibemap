require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC_11_0_002 - ระงับการใช้งานผู้ใช้สำเร็จ', async ({ browser }) => {

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
  // 3. รอข้อมูลผู้ใช้โหลด
  // =========================

  const userRows = page.locator('table tbody tr');

  await expect(async () => {
    expect(await userRows.count()).toBeGreaterThan(0);
  }).toPass({
    timeout: 90000,
  });

 // ค้นหาผู้ใช้
const searchBox =  page.getByRole('textbox', { name: 'ค้นหาชื่อ หรือ อีเมล' })
await searchBox.fill(targetEmail);

const filteredRows = page.locator('tbody tr');

await expect(async () => {
  expect(await filteredRows.count()).toBe(1);
}).toPass({
  timeout: 30000,
});

const userRow = filteredRows.first();

  // =========================
  // 5. ระงับผู้ใช้
  // =========================
const banButton = userRow.locator('button').first();

await expect(banButton).toBeEnabled();

await banButton.click();
  // =========================
  // 6. ยืนยันการระงับ
  // =========================

await page.getByRole('button', {
  name: 'ตกลง',
}).click();

await expect(userRow.getByText('BANNED')).toBeVisible({
  timeout: 30000,
});
  // =========================
  // 7. ตรวจสอบสถานะผู้ใช้
  // =========================
await expect(
    userRow.getByText('BANNED')
).toBeVisible();

  // =========================
  // 8. Screenshot
  // =========================

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: 'evidence/TC_11_0_002_SuspendUserSuccess.png',
    fullPage: true,
  });

  await context.close();

});