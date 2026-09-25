require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC 11.0.001 - ส่งข้อความถึงแอดมินสำเร็จ', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // =========================
  // 1. Login
  // =========================

  await page.goto('https://moodlocation.vercel.app/login');

  await page
    .getByPlaceholder('your@email.com')
    .fill('fernkk4@gmail.com');

  await page
    .locator('input[type="password"]')
    .fill('112233');

  await page.locator('button[type="submit"]').click();

  // รอ Toast Login สำเร็จ
  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeVisible({
    timeout: 30000,
  });

  // รอ Toast หาย
  await expect(
    page.getByText('เข้าสู่ระบบสำเร็จ')
  ).toBeHidden({
    timeout: 15000,
  });

  // รอจนเมนูผู้ใช้โหลดเสร็จ
  await expect(
    page.getByRole('link', { name: 'Profile' })
  ).toBeVisible({
    timeout: 30000,
  });

  // =========================
  // 2. เปิดศูนย์ช่วยเหลือ
  // =========================

  const helpCenterMenu = page
    .getByRole('navigation')
    .getByRole('link', {
      name: 'ศูนย์ช่วยเหลือ',
    });

  await helpCenterMenu.click();

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
    .fill('สอบถามการใช้งาน');

  await page
    .getByRole('textbox')
    .nth(1)
    .fill('ต้องการสอบถามเกี่ยวกับการใช้งานระบบ');

  const confirmButton = page.getByRole('button', {
    name: 'ยืนยันและเริ่มแชท',
  });

  await expect(confirmButton).toBeEnabled();

  await confirmButton.click();

  // =========================
  // 5. รอห้องแชทเปิด
  // =========================

  const messageInput = page.getByPlaceholder(
    'พิมพ์ข้อความของคุณที่นี่...'
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

  // ปุ่มส่งใน Form เดียวกับ Textbox
  const sendButton = messageInput
    .locator('xpath=ancestor::form')
    .locator('button[type="submit"]');

  await expect(sendButton).toBeEnabled();

  await sendButton.click();

  // =========================
  // 7. ตรวจสอบข้อความ
  // =========================

  const sentMessage = page
    .getByText(message, {
      exact: true,
    })
    .last();

  await expect(sentMessage).toBeVisible({
    timeout: 15000,
  });

  await sentMessage.scrollIntoViewIfNeeded();

  // =========================
  // 8. แคปหน้าจอ
  // =========================

  await page.screenshot({
    path: 'evidence/TC_11_0_001_SendMessageSuccess.png',
    fullPage: true,
  });

  await context.close();

});
