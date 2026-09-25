require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');
const path = require('path');

test('TC 9.0.005 - ตรวจสอบข้อมูลโปรไฟล์หลังจาก login', async ({ browser }) => {
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

  // --- 4. แก้ไขข้อมูลโปรไฟล์ ---
  const nameInput = page.getByRole('textbox').first();
  const surnameInput = page.getByRole('textbox').nth(1);
  const genderSelect = page.getByRole('combobox');

  await nameInput.fill('ทดสอบ');
  await surnameInput.fill('แก้ไขโปรไฟล์');

  await genderSelect.selectOption({
    label: 'หญิง',
  });

  const imagePath = path.resolve(
    __dirname,
    '../../test-data/profile.jpg'
  );

  console.log(imagePath);

  await page
    .locator('input[type="file"]')
    .setInputFiles(imagePath);

  // หากระบบอนุญาตให้แก้ไขอีเมล
  // await page.locator('input[type="email"]')
  //   .fill('664259023@webmail.npru.ac.th');

  // --- 5. บันทึกข้อมูล ---
  const saveButton = page.getByRole('button', {
    name: 'บันทึกการเปลี่ยนแปลง',
  });

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // --- 6. เก็บค่าข้อมูลใหม่ก่อน Logout ---
  const editedName = await nameInput.inputValue();
  const editedSurname = await surnameInput.inputValue();
  const editedGender = await genderSelect.inputValue();

  console.log('ข้อมูลใหม่ก่อน Logout:');
  console.log('ชื่อ:', editedName);
  console.log('นามสกุล:', editedSurname);
  console.log('เพศ:', editedGender);

  // =========================
  // Logout
  // =========================

  const logoutButton = page
    .getByRole('navigation')
    .getByRole('button', {
      name: 'ออกจากระบบ',
    });

  await logoutButton.click();

  await page
    .getByRole('button', {
      name: 'ตกลง',
    })
    .click();

  // =========================
  // Login อีกครั้ง
  // =========================

  await page
    .getByPlaceholder('example@mail.com')
    .fill('vibemaptester@gmail.com');

  await page
    .locator('input[type="password"]')
    .fill('Bfxrn2547-');

  await page.click('button[type="submit"]');

  // ตรวจว่า Login สำเร็จ
  await expect(
    page.getByRole('link', {
      name: 'Profile',
    })
  ).toBeVisible({
    timeout: 15000,
  });

  // --- 7. เข้า Profile อีกครั้ง ---
  await page
    .getByRole('link', {
      name: 'Profile',
    })
    .click();

  // รอข้อมูลโปรไฟล์แสดง
  const newNameInput = page.getByRole('textbox').first();
  const newSurnameInput = page.getByRole('textbox').nth(1);
  const newGenderSelect = page.getByRole('combobox');

  await expect(newNameInput).toBeVisible({
    timeout: 15000,
  });

  // --- 8. ตรวจสอบว่าข้อมูลหลัง Login ตรงกับข้อมูลที่เก็บไว้ก่อน Logout ---

  await expect(newNameInput).toHaveValue(editedName);

  await expect(newSurnameInput).toHaveValue(editedSurname);

  await expect(newGenderSelect).toHaveValue(editedGender);

  // --- 9. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_9_0_005_ProfileDataAfterLogin.png',
  });

  await context.close();
});