require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test('TC 9.0.002 - ตรวจสอบประวัติการนำทางกรณีไม่มีข้อมูล', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });
  const page = await context.newPage();

  // --- 1. Login Flow ---
  // แนะนำ: ใช้ Email บัญชีใหม่ที่เพิ่งสมัคร หรือบัญชีที่เคลียร์ประวัติแล้ว
  await page.goto('https://moodlocation.vercel.app/login');
  await page.getByPlaceholder('your@email.com').fill('fernkk4@gmail.com');
  await page.locator('input[type="password"]').fill('111111');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // --- 2. เปิดเมนูขีดสามขีด (ใช้ตัวเลือกที่คุณหาเจอจาก Class) ---
  const hamburgerMenu = page.locator('.hamburger-icon');
  await hamburgerMenu.waitFor({ state: 'visible', timeout: 10000 });
  await hamburgerMenu.click(); 

  // --- 3. คลิกเลือก "ประวัติการนำทาง" ---
  const historyMenuText = page.getByText('ประวัติการนำทาง');
  await historyMenuText.waitFor({ state: 'visible', timeout: 5000 });
  await historyMenuText.click(); 

  // รอหน้าประวัติโหลด
  await page.waitForLoadState('networkidle');

  // --- 4. ตรวจสอบเงื่อนไข (Assertion) กรณีไม่มีข้อมูล ---
  // ให้เปลี่ยนข้อความใน Regex ตามที่ระบบของคุณออกแบบไว้ตอนไม่มีข้อมูลจริงนะครับ 
  // เช่น "ไม่พบประวัติ", "ไม่มีข้อมูล", "คุณยังไม่มีประวัติการเดินทาง"
  const emptyStateText = page.getByText(/ไม่พบประวัติ|ไม่มีข้อมูล|ยังไม่มีประวัติ/).first();
  await expect(emptyStateText).toBeVisible({ timeout: 10000 });

  // --- 5. จัดการหน้าจอและแคปภาพหลักฐาน ---
  await page.setViewportSize({ width: 1280, height: 1000 }); // หน้าจอว่างเปล่าไม่ต้องตั้งสูงมากก็ได้ครับ
  await page.evaluate(() => window.scrollTo(0, 0)); // ดึงจอขึ้นบนสุดกัน Navbar บัง
  await page.waitForTimeout(2000); 

  // จับภาพหน้าจอเก็บหลักฐาน (กรณีไม่มีข้อมูล)
  await page.screenshot({ path: 'evidence/TC_9_0_002_HistoryEmpty.spec.png' });

  await context.close();
});