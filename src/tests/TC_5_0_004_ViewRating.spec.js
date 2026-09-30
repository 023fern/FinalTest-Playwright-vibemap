require("../Hooks/testResultHook");
const { test, expect } = require("@playwright/test");

test("TC 5.0.004 - แสดงคะแนนรีวิวของสถานที่สำเร็จ", async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ["geolocation"],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });

  const page = await context.newPage();

  await page.goto("https://moodlocation.vercel.app/login");

  await page
    .getByPlaceholder("example@mail.com")
    .fill("vibemaptester@gmail.com");

  await page.locator('input[type="password"]').fill("Bfxrn2547-");

  await page.click('button[type="submit"]');

  await page.waitForLoadState("networkidle");

  // เลือกอารมณ์ "เศร้า"
  const emotionBtn = page
    .locator("button")
    .filter({ hasText: "เศร้า" })
    .filter({ visible: true })
    .first();

  await emotionBtn.waitFor({ state: "visible" });
  await emotionBtn.click();

  // เลือกหมวดหมู่ "สวนสาธารณะ"
  const categoryBtn = page.getByRole("heading", {
    name: "บาร์",
  });

  await categoryBtn.waitFor({
    state: "visible",
    timeout: 15000,
  });

  await categoryBtn.click();

  // กดดูรูปภาพและรีวิว
  const viewButton = page
    .getByRole("button", { name: "ดูรูปภาพและรีวิว" })
    .first();

  await viewButton.waitFor({
    state: "visible",
    timeout: 20000,
  });

  await viewButton.click();

  // ตรวจสอบว่าเข้าสู่หน้ารายละเอียดสถานที่สำเร็จ
  const placeName = page.locator("main h1").first();
  await expect(placeName).toBeVisible({ timeout: 15000 });

  // // =========================
  // // ตรวจสอบรีวิวของสถานที่
  // // =========================

  // const reviewCards = page.locator(".bg-white.p-5");

  // // ต้องแสดงรีวิวทั้งหมด 5 รายการ
  // await expect(reviewCards).toHaveCount(5, {
  //   timeout: 15000,
  // });

  // // ตรวจสอบว่าทุกรีวิวแสดงอยู่
  // for (let i = 0; i < 5; i++) {
  //   await expect(reviewCards.nth(i)).toBeVisible();
  // }

  // ตรวจสอบคะแนนรีวิว
  const reviewCards = page.locator(".bg-white.p-5");

  await expect(reviewCards).toHaveCount(5, {
    timeout: 15000,
  });

  const ratings = [];

  for (let i = 0; i < 5; i++) {
    const rating = reviewCards
      .nth(i)
      .getByText(/^[1-5](?:\.0)?$/, { exact: true })
      .first();

    await expect(rating).toBeVisible();

    const ratingValue = await rating.textContent();
    ratings.push(Number(ratingValue.trim()));
  }

  // ตรวจสอบว่าเรียงจากคะแนนสูงไปต่ำ
  for (let i = 0; i < ratings.length - 1; i++) {
    expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
  }
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.screenshot({
    path: "evidence/TC_5_0_004_ViewRating.png",
    fullPage: true,
  });

  await context.close();
});
