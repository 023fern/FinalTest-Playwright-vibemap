require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');
const path = require('path');

test('TC 9.0.001 - การแก้ไขโปรไฟล์สำเร็จ', async ({ browser }) => {
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
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');
  // --- 2. เปิดเมนู ---
  const menuBtn = page.locator('.hamburger-icon');
  await expect(menuBtn).toBeVisible();

  await menuBtn.click();

  // --- 3. เปิดหน้าโปรไฟล์ ---
  const profileMenu = page.getByText('โปรไฟล์ของฉัน');

  await expect(profileMenu).toBeVisible();
  await profileMenu.click();

//   await page.waitForLoadState('networkidle');

  // --- 4. แก้ไขข้อมูลโปรไฟล์ ---
  await page.getByRole('textbox').first().fill('Test');
  await page.getByRole('textbox').nth(1).fill('EditProfile');
await page.getByRole('combobox').selectOption({
  label: 'ชาย'
});
const imagePath = path.resolve(__dirname, '../../test-data/profile.jpg');

console.log(imagePath);

await page.locator('input[type="file"]').setInputFiles(imagePath);
  // หากระบบอนุญาตให้แก้ไขอีเมล
  // สามารถแก้ไขได้โดยใช้ Locator นี้
  // await page.locator('input[type="email"]').fill('664259023@webmail.npru.ac.th');

  // เลือกข้อมูลจาก Combobox (แก้ไขตามข้อมูลจริงของระบบ)
  // await page.getByRole('combobox').selectOption({ label: '...' });

  // --- 5. บันทึกข้อมูล ---
  const saveButton = page.getByRole('button', {
    name: 'บันทึกการเปลี่ยนแปลง',
  });

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // --- 6. ตรวจสอบผลลัพธ์ ---
 const successToast = page.getByText(/อัปเดตข้อมูลเรียบร้อยแล้ว!|/).first();

  // --- 7. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: 'evidence/TC_9_0_001_EditProfileSuccess.png',
  });

  await context.close();
});