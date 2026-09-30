require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.004 - รูปแบบอีเมลไม่ถูกต้อง', async ({ page }) => {

  // เปิดหน้าสมัครสมาชิก
  await page.goto('https://moodlocation.vercel.app/register');

  // กรอกชื่อ
  await page
    .getByPlaceholder('ชื่อจริง')
    .fill('QA');

  // กรอกนามสกุล
  await page
    .getByPlaceholder('นามสกุล')
    .fill('Engineer');

  // กรอกอีเมลรูปแบบไม่ถูกต้อง
  const emailInput = page.getByPlaceholder('example@mail.com');

  await emailInput.fill('vibemap.com');

  // กรอกรหัสผ่าน
  await page
    .getByPlaceholder('รหัสผ่านของคุณ')
    .fill('Bfxrn-2547');

  // กรอกยืนยันรหัสผ่านให้ตรงกัน
  await page
    .getByPlaceholder('ยืนยันรหัสผ่าน')
    .fill('Bfxrn-2547');

  // เลือกเพศ
  await page.getByRole('button', {
    name: 'หญิง',
  }).click();

  // กดปุ่มสร้างบัญชี
  await page.getByRole('button', {
    name: 'สร้างบัญชีสมาชิก',
  }).click();

  // ตรวจสอบว่า Email ไม่ผ่าน validation
  await expect(emailInput).toHaveJSProperty(
    'validity.valid',
    false
  );

  // ตรวจสอบข้อความแจ้งเตือนของ Browser
  const validationMessage = await emailInput.evaluate(
    element => element.validationMessage
  );

  expect(validationMessage).toContain(
    "Please include an '@' in the email address"
  );

  // แคปหน้าจอ
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_1_0_003_InvalidEmailFormat.png',
    fullPage: true,
  });
});