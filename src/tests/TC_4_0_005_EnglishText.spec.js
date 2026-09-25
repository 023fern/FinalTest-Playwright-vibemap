require('../Hooks/testResultHook');
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('TC 4.0.001 - วิเคราะห์อารมณ์จากข้อความสำเร็จ', async ({ browser }) => {

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
test.setTimeout(120000);

const aiInput = page.getByRole('textbox', {
  name: 'พิมพ์บอกความรู้สึกกับ AI...'
});

await expect(aiInput).toBeVisible();

await aiInput.fill("I'm so hungry today.");
  await expect(aiInput)
    .toHaveValue("I'm so hungry today.");


const searchBtn = page.getByRole('button', {
  name: /ค้นหา/i
});

await expect(searchBtn).toBeVisible();

await searchBtn.click();

const placeNavigationBtns =
  page.locator('.w-9.h-9.rounded-full.bg-gray-50');

await expect(
  placeNavigationBtns.first()
).toBeVisible({
  timeout: 90000
});
  console.log('Place card loaded');

  // Screenshot
  await page.screenshot({
    path: 'evidence/TC_4_0_005_EnglishText.png',
    fullPage: true
  });

  console.log('Screenshot saved');

  await context.close();

  console.log('=== Test Finished ===');
});