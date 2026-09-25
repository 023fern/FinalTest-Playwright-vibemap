require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC 4.0.004 - ตรวจสอบข้อความภาษาไทยที่ไม่สามารถวิเคราะห์ได้', async ({ browser }) => {

  console.log('=== Start Test ===');

  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018
    },
  });

  const page = await context.newPage();

  // Login
  await page.goto('https://moodlocation.vercel.app/login');

  console.log('Login page loaded');

  await page.getByPlaceholder('your@email.com')
    .fill('664259023@webmail.npru.ac.th');

  await page.locator('input[type="password"]')
    .fill('111111');

  await page.click('button[type="submit"]');

  console.log('Login button clicked');

  await page.waitForLoadState('networkidle');

  console.log('Login success');


  // Textbox AI
  const aiInput = page.getByRole('textbox', {
    name: 'พิมพ์บอกความรู้สึกกับ AI...'
  });

  await expect(aiInput).toBeVisible();


  // กรอกข้อความที่ไม่มีความหมาย
  await aiInput.fill('ฟหฟกหเ้ะเด่');

  await expect(aiInput)
    .toHaveValue('ฟหฟกหเ้ะเด่');


  // ปุ่มค้นหา
  const searchBtn = page.getByRole('button', {
    name: /ค้นหา/i
  });

  await expect(searchBtn).toBeVisible();


  await searchBtn.click();


  // ตรวจสอบ Alert / Validation Message
  await expect(
    page.getByText('กรุณากรอกข้อความที่สื่อความหมาย')
  ).toBeVisible({
    timeout: 30000
  });


  console.log('Validation message displayed');


  // Screenshot
  await page.screenshot({
    path: 'evidence/TC_4_0_004_ThaiInvalidText.png',
    fullPage: true
  });


  console.log('Screenshot saved');

  await context.close();

  console.log('=== Test Finished ===');
});