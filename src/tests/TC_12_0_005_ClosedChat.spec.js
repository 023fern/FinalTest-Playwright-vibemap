require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(180000);

test('TC_12_0_005 - ปิดเคส/ลบแชทสำเร็จ', async ({ browser }) => {

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

  await expect(
    page.getByRole('link', { name: 'Profile' })
  ).toBeVisible();

//   // =========================
//   // 2. เปิดศูนย์ช่วยเหลือ
//   // =========================

  await page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    })
    .click();



//   // =========================
//   // 5. ส่งข้อความ
//   // =========================

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

//   // =========================
//   // 6. Logout User
//   // =========================


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
  page.getByPlaceholder('example@mail.com')
).toBeVisible({
  timeout: 30000,
});

  // =========================
  // 7. Login Admin
  // =========================

  // await page.goto('https://moodlocation.vercel.app/login');

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

const replyChatButton = page.getByRole('button', {
  name: 'ตอบแชทผู้ใช้',
});

await expect(replyChatButton).toBeVisible({
  timeout: 30000,
});

await expect(replyChatButton).toBeEnabled();

await replyChatButton.click();

// =========================
// 10. หา Card ของแชทที่ถูกปิด
// =========================
   const chatCard = page
    .getByText('ติดต่อสอบถามทั่วไป', {
      exact: true,
    })
    .first();

await expect(chatCard.first()).toBeVisible({
  timeout: 30000,
});


// =========================
// 11. กดปุ่มลบของ Card นี้
// =========================

const deleteButton = page.getByRole('button', { name: 'ลบแชท / ปิดเคส' }).first()

await expect(deleteButton).toBeVisible();

await expect(deleteButton).toBeEnabled();

await deleteButton.click();

// =========================
// 12. ยืนยันการปิดเคส
// =========================

const confirmCloseButton = page.getByRole('button', {
  name: 'ลบแชทและปิดเคส',
});

await expect(confirmCloseButton).toBeVisible({
  timeout: 10000,
});

await confirmCloseButton.click();

await expect(confirmCloseButton).toBeHidden({
  timeout: 10000,
});

// =========================
// 13. ตรวจสอบ Toast ย้ายแชทสำเร็จ
// =========================

await expect(
  page.getByText(/ย้าย.*สำเร็จ/, {
    exact: false,
  })
).toBeVisible({
  timeout: 15000,
});

// =========================
// 14. เปิด "ประวัติแชททั้งหมด"
// =========================

const chatHistory = page.getByText(
  'ประวัติแชททั้งหมด',
  {
    exact: true,
  }
);

await expect(chatHistory).toBeVisible({
  timeout: 15000,
});

await chatHistory.click();

// =========================
// 15. ตรวจสอบว่าแชทถูกย้ายมาอยู่ในประวัติ
// =========================

const historyChat = page.getByText(
  'ติดต่อสอบถามทั่วไป',
  {
    exact: true,
  }
).first();

await expect(historyChat).toBeVisible({
  timeout: 30000,
});
// =========================
// 14. Screenshot
// =========================

await page.evaluate(() => {
  window.scrollTo(0, 0);
});

await page.screenshot({
  path: 'evidence/TC_12_0_005_ClosedChat.png',
  fullPage: true,
});

await context.close();
});
