require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');
const path = require('path');

test('TC 10.0.004 - การยกเลิกการแก้ไขโปรไฟล์', async ({ browser }) => {
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
    .getByPlaceholder('your@email.com')
    .fill('fernkk4@gmail.com');

  await page
    .locator('input[type="password"]')
    .fill('112233');

  await page.click('button[type="submit"]');

  // --- 2. เปิดเมนู ---
  const menuBtn = page.locator('.hamburger-icon');

  await expect(menuBtn).toBeVisible();
  await menuBtn.click();

  // --- 3. เปิดหน้าโปรไฟล์ ---
  const profileMenu = page.getByText('โปรไฟล์ของฉัน');

  await expect(profileMenu).toBeVisible();
  await profileMenu.click();

  await page.waitForLoadState('networkidle');

  // --- 4. เก็บข้อมูลเดิม ---
  const firstNameInput = page.getByRole('textbox').first();
  const lastNameInput = page.getByRole('textbox').nth(1);
  const genderSelect = page.getByRole('combobox');

  const originalFirstName = await firstNameInput.inputValue();
  const originalLastName = await lastNameInput.inputValue();
  const originalGender = await genderSelect.inputValue();

  // --- 5. แก้ไขข้อมูล ---
  await firstNameInput.fill('Automation');
  await lastNameInput.fill('Testing');

  await genderSelect.selectOption({
    label: originalGender === 'ชาย' ? 'หญิง' : 'ชาย',
  });

  // เปลี่ยนรูป
  const imagePath = path.resolve(
    __dirname,
    '../../test-data/profile.jpg'
  );

  await page.locator('input[type="file"]').setInputFiles(imagePath);

  // --- 6. กดย้อนกลับ (ยกเลิกการแก้ไข) ---
  const backButton = page.locator('main button').first();

  await expect(backButton).toBeVisible();
  await backButton.click();

  // --- 7. เข้าโปรไฟล์อีกครั้ง ---
  await expect(menuBtn).toBeVisible();
  await menuBtn.click();

  await expect(profileMenu).toBeVisible();
  await profileMenu.click();

  await page.waitForLoadState('networkidle');

  // --- 8. ตรวจสอบว่าข้อมูลยังเป็นค่าเดิม ---
  await expect(page.getByRole('textbox').first())
    .toHaveValue(originalFirstName);

  await expect(page.getByRole('textbox').nth(1))
    .toHaveValue(originalLastName);

  await expect(page.getByRole('combobox'))
    .toHaveValue(originalGender);

  // --- 9. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: 'evidence/TC_10_0_004_ProfileCancelEdit.png',
  });

  await context.close();
});