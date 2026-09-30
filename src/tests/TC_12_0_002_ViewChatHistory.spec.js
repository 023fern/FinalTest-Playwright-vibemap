require('dotenv').config();
require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC 12.0.002 - เปิดดูประวัติการสนทนา', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =====================================================
  // Test Data
  // =====================================================

  const userMessage = `Playwright User ${Date.now()}`;
  const messageAdmin = `History ${Date.now()}`;

  // =====================================================
  // 1. Login User
  // =====================================================

  await page.goto('https://moodlocation.vercel.app/login');

  await page
    .getByPlaceholder('example@mail.com')
    .fill(process.env.MOOD_USER_EMAIL);

  await page
    .locator('input[type="password"]')
    .fill(process.env.MOOD_USER_PASSWORD);

  await page.click('button[type="submit"]');

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 2. เปิดศูนย์ช่วยเหลือ
  // =====================================================

  await page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    })
    .click();

  // =====================================================
  // 3. ส่งข้อความ User
  // =====================================================

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
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 4. Logout User
  // =====================================================

  await page
    .getByRole('navigation')
    .getByRole('button', {
      name: 'ออกจากระบบ',
    })
    .click();

  await page
    .getByRole('button', {
      name: 'ตกลง',
    })
    .click();

  await expect(
    page.getByPlaceholder('example@mail.com')
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 5. Login Admin
  // =====================================================

  await page
    .getByPlaceholder('example@mail.com')
    .fill(process.env.MOOD_ADMIN_EMAIL);

  await page
    .locator('input[type="password"]')
    .fill(process.env.MOOD_ADMIN_PASSWORD);

  await page.click('button[type="submit"]');

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 6. เปิดเมนูตอบแชทผู้ใช้
  // =====================================================

  const replyChatButton = page.getByRole('button', {
    name: 'ตอบแชทผู้ใช้',
  });

  await expect(replyChatButton).toBeVisible({
    timeout: 30000,
  });

  await replyChatButton.click();

  // =====================================================
  // 7. เปิดห้องสนทนา
  // =====================================================

  const chat = page
    .getByText('ติดต่อสอบถามทั่วไป', {
      exact: true,
    })
    .first();

  await expect(chat).toBeVisible({
    timeout: 30000,
  });

  await chat.click();

  // =====================================================
  // 8. ตรวจสอบข้อความ User
  // =====================================================

  await expect(
    page.getByText(userMessage, {
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
// 9. Admin ตอบข้อความ
// =====================================================

const adminMessageInput = page.getByPlaceholder(
  'พิมพ์ข้อความตอบกลับที่นี่...'
);

await expect(adminMessageInput).toBeVisible({
  timeout: 30000,
});

await adminMessageInput.fill(messageAdmin);

const sendReplyButton = adminMessageInput
  .locator('xpath=ancestor::form')
  .locator('button[type="submit"]');

await expect(sendReplyButton).toBeEnabled();

await sendReplyButton.click();

// ตรวจสอบว่าข้อความ Admin ถูกส่งแล้ว
await expect(
  page.getByText(messageAdmin, {
    exact: true,
  }).last()
).toBeVisible({
  timeout: 30000,
});

// ปิดหน้าต่างที่เปิดทับอยู่
await page.getByRole('button')
  .filter({ hasText: /^$/ })
  .nth(3)
  .click();

// =====================================================
// 10. Logout Admin
// =====================================================

await page.getByRole('button', {
  name: 'ออกจากระบบ',
}).click();

await page.getByRole('button', {
  name: 'ใช่, ออกจากระบบ',
}).click();

  // =====================================================
  // 11. Login Admin ใหม่
  // =====================================================

  await page
    .getByPlaceholder('example@mail.com')
    .fill(process.env.MOOD_ADMIN_EMAIL);

  await page
    .locator('input[type="password"]')
    .fill(process.env.MOOD_ADMIN_PASSWORD);

  await page.click('button[type="submit"]');

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 12. เปิดเมนูตอบแชทผู้ใช้อีกครั้ง
  // =====================================================

  const replyChatButtonAgain = page.getByRole('button', {
    name: 'ตอบแชทผู้ใช้',
  });

  await expect(replyChatButtonAgain).toBeVisible({
    timeout: 30000,
  });

  await replyChatButtonAgain.click();

  // =====================================================
  // 13. เปิดห้องสนทนาเดิม
  // =====================================================

  const chatAgain = page
    .getByText('ติดต่อสอบถามทั่วไป', {
      exact: true,
    })
    .first();

  await expect(chatAgain).toBeVisible({
    timeout: 30000,
  });

  await chatAgain.click();

  // =====================================================
  // 14. ตรวจสอบประวัติการสนทนา
  // =====================================================

  await expect(
    page.getByText(userMessage, {
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });

  await expect(
    page.getByText(messageAdmin, {
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 15. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_12_0_002_ViewChatHistory.png',
    fullPage: true,
  });

  await context.close();
});