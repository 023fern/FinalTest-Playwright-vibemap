require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC 10.0.002 - ดูประวัติการสนทนา', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeHidden({
    timeout: 15000,
  });

  await expect(
    page.getByRole('link', { name: 'Profile' })
  ).toBeVisible();

  // =========================
  //  เปิดศูนย์ช่วยเหลือ
  // =========================

  await page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    })
    .click();

  // =========================
  //  ส่งข้อความ
  // =========================

  const messageInput = page.getByPlaceholder(
    'พิมพ์ข้อความ...'
  );

  await expect(messageInput).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 6. ส่งข้อความ
  // =========================

  const message = `Playwright ${Date.now()}`;

  await messageInput.fill(message);

  await expect(messageInput).toHaveValue(message);


  const sendButton = messageInput
    .locator('xpath=ancestor::form')
    .locator('button[type="submit"]');

  await expect(sendButton).toBeEnabled();

  await sendButton.click();

  // =========================
  //  Logout
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



  await page.getByPlaceholder('example@mail.com').fill('vibemaptester@gmail.com');
  await page.locator('input[type="password"]').fill('Bfxrn2547-');
  await page.click('button[type="submit"]');

  await expect(
    page.getByRole('link', {
      name: 'Profile',
    })
  ).toBeVisible();

// =========================
// เปิดศูนย์ช่วยเหลือ
// =========================

await page
  .getByRole('navigation')
  .getByRole('link', {
    name: 'ศูนย์ช่วยเหลือ',
  })
  .click();



// =========================
// ตรวจสอบประวัติการสนทนา
// =========================

await expect(
  page.getByText(message, {
    exact: true,
  })
).toBeVisible({
  timeout: 30000,
});

  // =========================
  // 10. Screenshot
  // =========================
await page.evaluate(() => {
  window.scrollTo(0, 0);
});

  await page.screenshot({
    path: 'evidence/TC_10_0_002_ChatHistory.png',
    fullPage: true,
  });

  await context.close();

});