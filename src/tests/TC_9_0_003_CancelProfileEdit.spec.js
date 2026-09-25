const path = require('path');
require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 9.0.003 - การยกเลิกการแก้ไขโปรไฟล์', async ({ browser }) => {
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

  // --- 4. เก็บข้อมูลเดิม ---
  const nameInput = page.getByRole('textbox').first();
  const surnameInput = page.getByRole('textbox').nth(1);
  const emailInput = page.locator('input[type="email"]');
  const genderSelect = page.getByRole('combobox');

  const originalName = await nameInput.inputValue();
  const originalSurname = await surnameInput.inputValue();
  const originalEmail = await emailInput.inputValue();
  const originalGender = await genderSelect.inputValue();

  // --- 5. แก้ไขข้อมูล แต่ยังไม่บันทึก ---
  await nameInput.fill('TestCancel');
  await surnameInput.fill('CancelProfile');

  await genderSelect.selectOption({
    label: 'ชาย',
  });

  const imagePath = path.resolve(__dirname, '../../test-data/1.jpg');
  await page.locator('input[type="file"]').setInputFiles(imagePath);

  // --- 6. กดไอคอนย้อนกลับเพื่อยกเลิกการแก้ไข ---
  const backButton = page.getByRole('link', { name: 'MoodPlace Logo' })

await expect(backButton).toBeVisible();
await backButton.click();

// รอให้หน้าออกจากโหมดแก้ไขจริง
await expect(
  page.getByRole('button', {
    name: 'บันทึกการเปลี่ยนแปลง',
  })
).toBeHidden({ timeout: 10000 });

// --- 7. เปิดเมนู Navbar ใหม่ ---
await expect(menuBtn).toBeVisible({ timeout: 10000 });
await menuBtn.click();

// รอเมนูโปรไฟล์
await expect(profileMenu).toBeVisible({ timeout: 10000 });
await profileMenu.click();

// ไม่ใช้ networkidle
await expect(
  page.getByRole('textbox').first()
).toBeVisible({ timeout: 15000 });

// --- 8. ตรวจสอบว่าข้อมูลยังเป็นค่าเดิม ---
await expect(
  page.getByRole('textbox').first()
).toHaveValue(originalName);

await expect(
  page.getByRole('textbox').nth(1)
).toHaveValue(originalSurname);

await expect(
  page.locator('input[type="email"]')
).toHaveValue(originalEmail);

await expect(
  page.getByRole('combobox')
).toHaveValue(originalGender);


  // --- 10. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_9_0_003_CancelProfileEdit.png',
  });

  await context.close();
});