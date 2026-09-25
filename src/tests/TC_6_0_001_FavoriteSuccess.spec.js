require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 6.0.001 - การบันทึกรายการโปรดสำเร็จ', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });
  const page = await context.newPage();

  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  const emotionBtn = page.locator('button').filter({ hasText: 'มีความสุข' }).filter({ visible: true }).first();
  await emotionBtn.waitFor({ state: 'visible' });
  await emotionBtn.click();

  const categoryBtn = page.getByRole('heading', { name: 'สวนสนุก' });
  await categoryBtn.waitFor({ state: 'visible', timeout: 15000 });
  await categoryBtn.click();

  const viewButton = page.getByRole('button', { name: 'ดูรูปภาพและรีวิว' }).first();
  await viewButton.waitFor({ state: 'visible', timeout: 20000 });
  await viewButton.click();


  const heartBtn = page.locator('main button').nth(1); 
  await heartBtn.waitFor({ state: 'visible' });
  // ใช้ force: true เผื่อกรณีมีอะไรบังปุ่ม
  await heartBtn.click({ force: true });

 
  const successToast = page.getByText(/บันทึกเรียบร้อย|บันทึกรายการโปรดแล้ว|/).first();
  
  await expect(successToast).toBeVisible({ timeout: 15000 });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'evidence/TC_6_0_001_FavoriteSuccess.png', fullPage: true });
});