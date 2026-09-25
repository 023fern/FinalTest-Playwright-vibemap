require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');
const path = require('path');

test('TC 9.0.002 - การแก้ไขโปรไฟล์เฉพาะบางข้อมูล', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

  // --- 1. Login ---
  await page.goto('https://moodlocation.vercel.app/login');

  await page
    .getByPlaceholder('example@mail.com')
    .fill('vibemaptester@gmail.com');

  await page
    .locator('input[type="password"]')
    .fill('Bfxrn2547-');

  await page.click('button[type="submit"]');

  // --- 2. เปิดเมนู ---
  const menuBtn = page.locator('.hamburger-icon');

  await expect(menuBtn).toBeVisible();
  await menuBtn.click();

  // --- 3. เปิดหน้าโปรไฟล์ ---
  const profileMenu = page.getByText('โปรไฟล์ของฉัน');

  await expect(profileMenu).toBeVisible();
  await profileMenu.click();

  // await page.waitForLoadState('networkidle');

  // --- 4. แก้ไขข้อมูลโปรไฟล์ ---

  // เปลี่ยนชื่อ
  // await page.getByRole('textbox').first().fill('Test');

  // เปลี่ยนนามสกุล
  await page.getByRole('textbox').nth(1).fill('EditProfile');

  // เปลี่ยนเพศ
  // await page.getByRole('combobox').selectOption({
  //   label: 'ชาย'
  // });

  // เปลี่ยนรูปภาพ
  // const imagePath = path.resolve(
  //   __dirname,
  //   '../../test-data/profile.jpg'
  // );
  //
  // console.log(imagePath);
  //
  // await page.locator('input[type="file"]').setInputFiles(imagePath);

  // หากระบบอนุญาตให้แก้ไขอีเมล
  // await page.locator('input[type="email"]')
  //   .fill('664259023@webmail.npru.ac.th');

  // เลือกข้อมูลจาก Combobox
  // await page.getByRole('combobox').selectOption({
  //   label: '...'
  // });

  // --- 5. บันทึกข้อมูล ---
  const saveButton = page.getByRole('button', {
    name: 'บันทึกการเปลี่ยนแปลง',
  });

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // --- 6. ตรวจสอบผลลัพธ์ ---
  const successToast = page.getByText(
    'อัปเดตข้อมูลเรียบร้อย!',
    { exact: true }
  );

  await expect(successToast).toBeVisible({
    timeout: 15000,
  });

  // --- 7. ตรวจสอบข้อมูลก่อนจับภาพ ---

  // ชื่อยังมีข้อมูลและไม่ได้ถูกล้าง
  await expect(
    page.getByRole('textbox').first()
  ).not.toHaveValue('');

  // นามสกุลต้องเปลี่ยนเป็นค่าที่กำหนด
  await expect(
    page.getByRole('textbox').nth(1)
  ).toHaveValue('EditProfile');

  // อีเมลยังมีข้อมูลและไม่ได้ถูกล้าง
  await expect(
    page.locator('input[type="email"]')
  ).not.toHaveValue('');

  // เพศยังมีข้อมูลและไม่ได้ถูกล้าง
  await expect(
    page.getByRole('combobox')
  ).not.toHaveValue('');

  // --- 8. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_9_0_002_EmptyProfile.png',
  });

  await context.close();
});