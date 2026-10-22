require('dotenv').config();
require('../Hooks/testResultHook');

const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC 12.0.004 - สถานะห้องสนทนาเปลี่ยนเป็นตอบแล้ว', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =====================================================
  // Test Data
  // =====================================================

  const userMessage = `Playwright User ${Date.now()}`;
  const messageAdmin = `Reply ${Date.now()}`;

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

  // ตรวจสอบว่าข้อความตอบกลับถูกส่งสำเร็จ
  await expect(
    page.getByText(messageAdmin, {
      exact: true,
    }).last()
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 10. ปิดหน้าต่างแชท
  // =====================================================

  await page
    .locator('.p-2.text-gray-400')
    .click();

  // =====================================================
  // 11. ตรวจสอบสถานะห้องสนทนา
  // =====================================================

  await expect(
    page.getByText('ตอบแล้ว', {
      exact: true,
    })
  ).toBeVisible({
    timeout: 30000,
  });

  // =====================================================
  // 12. Screenshot
  // =====================================================

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: 'evidence/TC_12_0_004_ChatStatusAnswered.png',
    fullPage: true,
  });

  await context.close();
});