require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 6.0.003 - ยกเลิกบันทึกรายการโปรด', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });
  const page = await context.newPage();

  // --- Login Flow ---
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // --- Selection Flow ---
  const emotionBtn = page.locator('button').filter({ hasText: 'มีความสุข' }).filter({ visible: true }).first();
  await emotionBtn.waitFor({ state: 'visible' });
  await emotionBtn.click();

  const categoryBtn = page.getByRole('heading', { name: 'สวนสนุก' });
  await categoryBtn.waitFor({ state: 'visible', timeout: 15000 });
  await categoryBtn.click();

  const viewButton = page.getByRole('button', { name: 'ดูรูปภาพและรีวิว' }).first();
  await viewButton.waitFor({ state: 'visible', timeout: 20000 });
  await viewButton.click();

  // --- Favorite Action (Click 1: บันทึก) ---
  const heartBtn = page.locator('main button').nth(1); 
  await heartBtn.click();

  // รอให้ Toast บันทึกเด้งขึ้นมาและหายไปก่อน (ใช้ .first() เพื่อป้องกัน Error Strict Mode)
  const savedToast = page.getByText(/บันทึก|สำเร็จ|เพิ่ม/).first();
  // await savedToast.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => console.log('Toast still there, but trying to click anyway'));

  // --- Unfavorite Action (Click 2: ยกเลิก) ---
  // แก้ไข: ลบ 'const' ออกเพราะประกาศ heartBtn ไปแล้วข้างบน
  await heartBtn.scrollIntoViewIfNeeded(); 
  
  // ใช้ force: true เพื่อให้มั่นใจว่ากดโดนปุ่มแน่นอน แม้จะมี Toast บัง
  await heartBtn.click({ force: true });
  
  // แก้ไข: ปรับ Regex ให้ระบุคำชัดเจนขึ้น 
  const unsavedToast = page.getByText(/นำออก|ยกเลิก|ลบ/).first();
  await expect(unsavedToast).toBeVisible({ timeout: 10000 });

  await page.screenshot({ path: 'evidence/TC_6_0_003_DuplicateFavorite.png', fullPage: true });
});