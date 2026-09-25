require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 1.0.002 - กรอกข้อมูลไม่ครบถ้วน', async ({ page }) => {

  // เปิดหน้าสมัครสมาชิก
  await page.goto('https://moodlocation.vercel.app/register');

  // กรอกชื่อ
  await page
    .getByPlaceholder('ชื่อจริง')
    .fill('QA');

  //  กรอกนามสกุล
  await page
    .getByPlaceholder('นามสกุล')
    .fill('Engineer');


  // กรอกรหัสผ่าน
  await page
    .getByPlaceholder('รหัสผ่านของคุณ')
    .fill('Bfxrn2547.');

  //  กรอกยืนยันรหัสผ่าน
  await page
    .getByPlaceholder('ยืนยันรหัสผ่าน')
    .fill('Bfxrn2547.');

  // เลือกเพศ
  await page.getByRole('button', { name: 'หญิง' }).click();

  //  กดปุ่มสร้างบัญชี
  await page.getByRole('button', {
    name: 'สร้างบัญชีสมาชิก',
  }).click();


await expect(
  page.getByText('กรุณากรอกอีเมล', { exact: true })
).toBeVisible();

  // แคปหน้าจอ

  await page.evaluate(() => {
  window.scrollTo(0, 0);
});

  await page.screenshot({
    path: 'evidence/TC_1_0_002_RegisterIncompleteData.png',
    fullPage: true,
  });

});