require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 10.0.005 - กดบันทึกโดยไม่แก้ไขข้อมูล', async ({ browser }) => {
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

  // --- 5. กดบันทึกโดยไม่แก้ไขข้อมูล ---
  const saveButton = page.getByRole('button', {
    name: 'บันทึกการเปลี่ยนแปลง',
  });

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // --- 6. โหลดข้อมูลใหม่ ---
  await page.reload();
  await page.waitForLoadState('networkidle');

  // --- 7. ตรวจสอบว่าข้อมูลยังเหมือนเดิม ---
  await expect(page.getByRole('textbox').first())
    .toHaveValue(originalFirstName);

  await expect(page.getByRole('textbox').nth(1))
    .toHaveValue(originalLastName);

  await expect(page.getByRole('combobox'))
    .toHaveValue(originalGender);

  // --- 8. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: 'evidence/TC_10_0_005_SaveWithoutEditing.png',
  });

  await context.close();
});