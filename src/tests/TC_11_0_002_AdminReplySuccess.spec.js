require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC 11.0.002 - ตรวจสอบการรับข้อความตอบกลับจากแอดมิน', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =========================
  // Test Data
  // =========================

  const userEmail = 'fernkk4@gmail.com';
  const userPassword = '112233';

  const adminEmail = '664259023@webmail.npru.ac.th';
  const adminPassword = '111111';

  const userMessage = `Playwright User ${Date.now()}`;
  const adminReply = `Admin Reply ${Date.now()}`;

  // =========================
  // 1. Login User
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com').fill(userEmail);

  await page.locator('input[type="password"]').fill(userPassword);

  await page.locator('button[type="submit"]').click();

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
  // 2. เปิดศูนย์ช่วยเหลือ
  // =========================

  await page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    })
    .click();

  // =========================
  // 3. เปิดแชท
  // =========================

  const openChatButton = page.getByRole('button', {
    name: 'เปิดช่องแชท',
  });

  await expect(openChatButton).toBeEnabled();

  await openChatButton.click();

  // =========================
  // 4. กรอกข้อมูล
  // =========================

  await page
    .getByRole('textbox')
    .first()
    .fill('Automation Test');

  await page
    .getByRole('textbox')
    .nth(1)
    .fill('ตรวจสอบข้อความตอบกลับจากผู้ดูแลระบบ');

  await page
    .getByRole('button', {
      name: 'ยืนยันและเริ่มแชท',
    })
    .click();

  // =========================
  // 5. ส่งข้อความ
  // =========================

  const messageInput = page.getByPlaceholder(
    'พิมพ์ข้อความของคุณที่นี่...'
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


// กดปุ่มออกจากระบบ
const logoutButton = page
  .getByRole('navigation')
  .getByRole('button', {
    name: 'ออกจากระบบ',
  });

await expect(logoutButton).toBeVisible();

await logoutButton.click();

// รอ Dialog แสดง
const confirmLogoutButton = page.getByRole('button', {
  name: 'ตกลง',
});

await expect(confirmLogoutButton).toBeVisible({
  timeout: 10000,
});

await confirmLogoutButton.click();

// รอกลับหน้า Login
await expect(
  page.getByPlaceholder('your@email.com')
).toBeVisible({
  timeout: 30000,
});

  // =========================
  // 7. Login Admin
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com').fill(adminEmail);

  await page
    .locator('input[type="password"]')
    .fill(adminPassword);

  await page.locator('button[type="submit"]').click();

  // await expect(
  //   page.getByText('เข้าสู่ระบบสำเร็จ')
  // ).toBeVisible({
  //   timeout: 30000,
  // });

  // =========================
  // 8. ตอบข้อความ
  // =========================

//   await page.getByRole('link', {
//   name: 'แดชบอร์ด',
// }).click();

const replyChatButton = page.getByRole('button', {
  name: 'ตอบแชทผู้ใช้',
});

await expect(replyChatButton).toBeVisible({
  timeout: 30000,
});

await expect(replyChatButton).toBeEnabled();

await replyChatButton.click();

// เปิดห้อง Automation Test
const chatRoom = page.getByText('Automation Test', {
  exact: true,
});

await expect(chatRoom).toBeVisible({
  timeout: 30000,
});

await chatRoom.click();

// รอช่องตอบข้อความ
const adminMessageInput = page.getByPlaceholder(
  'พิมพ์ข้อความตอบกลับที่นี่...'
);

await expect(adminMessageInput).toBeVisible({
  timeout: 30000,
});

// พิมพ์ข้อความตอบกลับ
await adminMessageInput.fill(adminReply);

await expect(adminMessageInput).toHaveValue(adminReply);

// ปุ่มส่งใน Form เดียวกับ Textbox
const sendReplyButton = adminMessageInput
  .locator('xpath=ancestor::form')
  .locator('button[type="submit"]');

await expect(sendReplyButton).toBeEnabled();

await sendReplyButton.click();

// ตรวจสอบข้อความส่งสำเร็จ
await expect(
  page.getByText(adminReply, {
    exact: true,
  })
).toBeVisible({
  timeout: 30000,
});
const closeChatButton = page
  .getByRole('button')
  .filter({ hasText: /^$/ })
  .nth(2);

await expect(closeChatButton).toBeVisible({
  timeout: 30000,
});

await closeChatButton.click();
// =========================
// 9. Logout Admin
// =========================


const adminLogoutButton = page.getByRole('button', {
  name: 'ออกจากระบบ',
});

await expect(adminLogoutButton).toBeVisible({
  timeout: 30000,
});

await adminLogoutButton.click();
const adminConfirmLogoutButton = page.getByRole('button', {
  name: 'ใช่, ออกจากระบบ',
});

await expect(adminConfirmLogoutButton).toBeVisible({
  timeout: 10000,
});

await adminConfirmLogoutButton.click();

await expect(
  page.getByPlaceholder('your@email.com')
).toBeVisible({
  timeout: 30000,
});

  // =========================
  // 10. Login User อีกครั้ง
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');

  await page.getByPlaceholder('your@email.com').fill(userEmail);

  await page
    .locator('input[type="password"]')
    .fill(userPassword);

  await page.locator('button[type="submit"]').click();

  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  await expect(
    page.getByRole('link', {
      name: 'Profile',
    })
  ).toBeVisible();

  // =========================
  // 11. เปิดศูนย์ช่วยเหลือ
  // =========================

  await page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    })
    .click();

  // =========================
  // 3. เปิดแชท
  // =========================

  const OpenChatButton = page.getByRole('button', {
    name: 'เปิดช่องแชท',
  });

  await expect(OpenChatButton).toBeEnabled();

  await OpenChatButton.click();

    await page
    .getByRole('textbox')
    .first()
    .fill('Automation Test');

  await page
    .getByRole('textbox')
    .nth(1)
    .fill('ตรวจสอบข้อความตอบกลับจากผู้ดูแลระบบ');

  await page
    .getByRole('button', {
      name: 'ยืนยันและเริ่มแชท',
    })
    .click();

  // =========================
  // 13. ตรวจสอบข้อความตอบกลับ
  // =========================

  const replyMessage = page.getByText(adminReply, {
    exact: true,
  });

  await expect(replyMessage).toBeVisible({
    timeout: 30000,
  });

  await replyMessage.scrollIntoViewIfNeeded();

  // ตรวจสอบข้อความเรียงลำดับ
  await expect(
    page.getByText(userMessage, {
      exact: true,
    })
  ).toBeVisible();

  // =========================
  // 14. Screenshot
  // =========================
await page.evaluate(() => {
  window.scrollTo(0, 0);
});

  await page.screenshot({
    path: 'evidence/TC_11_0_002_AdminReplySuccess.png',
    fullPage: true,
  });

  await context.close();

});