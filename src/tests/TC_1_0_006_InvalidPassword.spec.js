require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC_1_0_006 - รหัสผ่านไม่ตรงตามเงื่อนไข', async ({ page }) => {

  await page.goto('https://moodlocation.vercel.app/register');

  await page.getByPlaceholder('ชื่อจริง').fill('QA');
  await page.getByPlaceholder('นามสกุล').fill('Engineer');
  await page
    .getByPlaceholder('example@mail.com')
    .fill('vibemaptester@gmail.com');

  await page
    .getByPlaceholder('รหัสผ่านของคุณ')
    .fill('Bfxrn2547');

  await page
    .getByPlaceholder('ยืนยันรหัสผ่าน')
    .fill('Bfxrn2547');

  await page.getByRole('button', { name: 'หญิง' }).click();

  const passwordRules = [
    'มีอย่างน้อย 8 ตัวอักษร',
    'มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว',
    'รหัสผ่านต้องไม่มีภาษาไทย',
    'มีตัวเลขอย่างน้อย 1 ตัว',
    'มีอักขระพิเศษอย่างน้อย 1 ตัว',
  ];

  for (const rule of passwordRules) {
    await expect(
      page.getByText(rule, { exact: true })
    ).toBeVisible();
  }

  // เลื่อนกลับด้านบนก่อนแคป
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // แคปเฉพาะหน้าที่มองเห็น
  await page.screenshot({
    path: 'evidence/TC_1_0_006_InvalidPassword.png',
  });
});