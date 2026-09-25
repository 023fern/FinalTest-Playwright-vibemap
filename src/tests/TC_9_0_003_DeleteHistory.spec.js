require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 9.0.001 - E2E Navigation History Flow', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });

  const page = await context.newPage();

  // LOGIN
  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com').fill('664259023@webmail.npru.ac.th');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');

  await expect(page).not.toHaveURL(/login/);

  // SELECT EMOTION
  const emotionBtn = page.getByRole('button', { name: /เบื่อ/ });
  await expect(emotionBtn).toBeVisible({ timeout: 15000 });
  await emotionBtn.click();

  // SELECT CATEGORY
  const categoryBtn = page.locator('button, h1, h2, h3, h4, h5, h6')
    .filter({ hasText: 'พิพิธภัณฑ์' })
    .first();

  await categoryBtn.waitFor({ state: 'visible', timeout: 15000 });
  await categoryBtn.click();

  await page.waitForLoadState('networkidle');

  // OPEN PLACE DETAIL
  const viewButton = page.getByRole('button', { name: 'ดูรูปภาพและรีวิว' }).first();
  await viewButton.waitFor({ state: 'visible', timeout: 20000 });
  await viewButton.click();
  await page.waitForLoadState('load');

  // 5. กดนำทาง และปิดแท็บ Google Maps ที่เด้งขึ้นมาใหม่
  const navigateBtn = page.getByRole('button', { name: 'เริ่มการนำทางไปที่นี่' }).first();
  await navigateBtn.waitFor({ state: 'visible', timeout: 15000 });

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    navigateBtn.click()
  ]);

  await newPage.waitForLoadState('load');
  console.log('เปิดหน้า Maps สำเร็จ:', newPage.url());
  await newPage.close(); 
  
  // 6. เปิดเมนูขีดสามขีด
  const hamburgerMenu = page.locator('.hamburger-icon');
  await hamburgerMenu.waitFor({ state: 'visible', timeout: 10000 });
  await hamburgerMenu.click(); 

  // 7. คลิกเลือกเมนู "ประวัติการนำทาง"
  const historyMenuText = page.getByText('ประวัติการนำทาง');
  await historyMenuText.waitFor({ state: 'visible', timeout: 5000 });
  await historyMenuText.click(); 
  // รอให้หน้า History โหลดเสร็จ
await page.waitForLoadState('networkidle');

// Debug ดูจำนวนปุ่มทั้งหมด

const deleteButtons = page.locator(
  'button:has(svg.lucide-trash-2)'
);

await expect(deleteButtons.first()).toBeVisible();

const beforeCount = await deleteButtons.count();

const deleteResponsePromise = page.waitForResponse(
  res =>
    res.request().method() === 'DELETE' &&
    res.url().includes('/history')
);

await deleteButtons.first().click();

const confirmDeleteBtn = page.getByRole('button', {
  name: 'ใช่, ลบออก'
});

await expect(confirmDeleteBtn).toBeVisible({
  timeout: 5000
});

await confirmDeleteBtn.click();
const response = await deleteResponsePromise;

expect(response.ok()).toBeTruthy();

await expect.poll(async () => {
  return await page.locator(
    'button:has(svg.lucide-trash-2)'
  ).count();
}).toBe(beforeCount - 1);
  await page.screenshot({
    path: 'evidence/TC_9_0_003_DeleteHistory.png'
  });

  await context.close();
});