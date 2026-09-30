require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC_12_0_001 - ผู้ดูแลระบบตอบข้อความผู้ใช้สำเร็จ', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =========================
  // Test Data
  // =========================

  const userMessage = `Playwright User ${Date.now()}`;
  const adminReply = `Admin Reply ${Date.now()}`;

  // =========================
  // 1. Login User
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('example@mail.com').fill(process.env.MOOD_USER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.MOOD_USER_PASSWORD);
  await page.click('button[type="submit"]');

  await expect(page.getByText('เข้าสู่ระบบสำเร็จ')).toBeVisible({
    timeout: 30000,
  });

//   await expect(page.getByText('เข้าสู่ระบบสำเร็จ')).toBeHidden({
//     timeout: 15000,
//   });

  // =========================
  // 2. เปิดศูนย์ช่วยเหลือ
  // =========================

  await page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    })
    .click();



  // =========================
  // 5. ส่งข้อความ
  // =========================

  const messageInput = page.getByPlaceholder(
    'พิมพ์ข้อความ...'
  );

  await expect(messageInput).toBeVisible({
    timeout: 30000,
  });

  await messageInput.fill(userMessage);

  const sendButton = messageInput
    .locator('xpath=ancestor::form')
    .locator('button[type="submit"]');

  await expect(sendButton).toBeEnabled();

  await sendButton.click();

  await expect(
    page.getByText(userMessage, {
      exact: true,
    }).last()
  ).toBeVisible();

  // =========================
  // 6. Logout User
  // =========================

  await page
    .getByRole('navigation')
    .getByRole('button', {
      name: 'ออกจากระบบ',
    })
    .click();

  await page.getByRole('button', {
    name: 'ตกลง',
  }).click();

  await expect(
    page.getByPlaceholder('example@mail.com')
  ).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 7. Login Admin
  // =========================

  await page.getByPlaceholder('example@mail.com').fill(process.env.MOOD_ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.MOOD_ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page.getByText('เข้าสู่ระบบสำเร็จ')).toBeVisible({
    timeout: 30000,
  });

//   await expect(page.getByText('เข้าสู่ระบบสำเร็จ')).toBeHidden({
//     timeout: 15000,
//   });

  // =========================
  // 8. เปิดเมนูตอบแชทผู้ใช้
  // =========================

  const replyChatButton = page.getByRole('button', {
    name: 'ตอบแชทผู้ใช้',
  });

  await expect(replyChatButton).toBeVisible({
    timeout: 30000,
  });

  await replyChatButton.click();

  // =========================
  // 9. เปิดห้องสนทนา
  // =========================

const chat = page.getByText('ติดต่อสอบถามทั่วไป', {
  exact: true,
}).first();

await expect(chat).toBeVisible();
await chat.click();

  // =========================
  // 10. ตรวจสอบข้อความผู้ใช้
  // =========================

  await expect(
    page.getByText(userMessage, {
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 11. ตอบข้อความ
  // =========================

  const adminMessageInput = page.getByPlaceholder(
    'พิมพ์ข้อความตอบกลับที่นี่...'
  );

  await expect(adminMessageInput).toBeVisible({
    timeout: 30000,
  });

  await adminMessageInput.fill(adminReply);

  const sendReplyButton = adminMessageInput
    .locator('xpath=ancestor::form')
    .locator('button[type="submit"]');

  await expect(sendReplyButton).toBeEnabled();

  await sendReplyButton.click();

  // =========================
  // 12. ตรวจสอบข้อความตอบกลับ
  // =========================

  await expect(
    page.getByText(adminReply, {
      exact: true,
    }).last()
  ).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 13. Screenshot
  // =========================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_12_0_001_AdminReplySuccess.png',
    fullPage: true,
  });

  await context.close();

});