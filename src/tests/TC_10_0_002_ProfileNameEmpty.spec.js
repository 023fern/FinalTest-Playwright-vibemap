require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 10.0.002 - การแก้ไขโปรไฟล์โดยไม่กรอกชื่อ', async ({ browser }) => {
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

const nameInput = page.getByRole('textbox').first();
const originalName = await nameInput.inputValue();

await nameInput.clear();

const saveButton = page.getByRole('button', {
  name: 'บันทึกการเปลี่ยนแปลง',
});

await saveButton.click();

await page.reload();
await page.waitForLoadState('networkidle');

await expect(page.getByRole('textbox').first()).toHaveValue(originalName);


  // --- 7. จับภาพหลักฐาน ---
  await page.setViewportSize({
    width: 1280,
    height: 1000,
  });

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: 'evidence/TC_10_0_002_ProfileEditWithoutName.png',
  });

  await context.close();
});