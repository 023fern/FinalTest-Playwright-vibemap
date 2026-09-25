require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 7.0.002 - การลบประวัติการเดินทาง', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

  // Login
  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('example@mail.com')
    .fill('vibemaptester@gmail.com');

  await page.locator('input[type="password"]')
    .fill('Bfxrn2547-');

  await page.click('button[type="submit"]');

  await expect(page).not.toHaveURL(/login/);

  // เลือกอารมณ์
  const emotionBtn = page.getByRole('button', { name: /เบื่อ/ });
  await expect(emotionBtn).toBeVisible({ timeout: 15000 });
  await emotionBtn.click();

  // เลือกหมวดหมู่
  const categoryBtn = page.locator(
    'button, h1, h2, h3, h4, h5, h6'
  ).filter({ hasText: 'ทะเล' }).first();

  await expect(categoryBtn).toBeVisible({ timeout: 15000 });
  await categoryBtn.click();

  // เปิดรายละเอียดสถานที่
  const viewButton = page.getByRole('button', {
    name: 'ดูรูปภาพและรีวิว'
  }).first();

  await expect(viewButton).toBeVisible({ timeout: 20000 });
  await viewButton.click();

  // ค้นหาเส้นทาง
  const navigateBtn = page.getByRole('button', {
    name: 'ค้นหาเส้นทาง'
  });

  await expect(navigateBtn).toBeVisible({ timeout: 15000 });

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    navigateBtn.click(),
  ]);

  await newPage.waitForLoadState('load');
  console.log('เปิดหน้า Maps สำเร็จ:', newPage.url());
  await newPage.close();

  // เปิดเมนู
  const hamburgerMenu = page.locator('.hamburger-icon');
  await expect(hamburgerMenu).toBeVisible({ timeout: 10000 });
  await hamburgerMenu.click();

  // เปิดประวัติการนำทาง
  const historyMenuText = page.getByText('ประวัติการนำทาง', {
    exact: true,
  });

  await expect(historyMenuText).toBeVisible({
    timeout: 10000,
  });

  await historyMenuText.click();

  // รอรายการประวัติ
  const deleteButtons = page.locator(
    'button:has(svg.lucide-trash-2)'
  );

  await expect(deleteButtons.first()).toBeVisible({
    timeout: 15000,
  });

  // ลบรายการแรก
  await deleteButtons.first().click();

// ยืนยันการลบ
const confirmDeleteBtn = page.getByRole('button', {
  name: 'ใช่, ลบออก',
});

await expect(confirmDeleteBtn).toBeVisible({
  timeout: 5000,
});

await confirmDeleteBtn.click();

// รอ Dialog "ลบสำเร็จ"
const successDialog = page.getByRole('dialog', {
  name: 'ลบสำเร็จ',
});

await expect(successDialog).toBeVisible({
  timeout: 10000,
});

// แคปทันที
await page.evaluate(() => {
  window.scrollTo(0, 0);
});

await page.screenshot({
  path: 'evidence/TC_7_0_002_DeleteHistory.png',
  fullPage: false,
});

});