require("../Hooks/testResultHook");
const { test, expect } = require("@playwright/test");

test.setTimeout(300000);

test("TC_6_0_002 - การบันทึกรายการโปรดไม่สำเร็จเนื่องจากรายการเต็ม", async ({
  browser,
}) => {
  const context = await browser.newContext({
    permissions: ["geolocation"],
    geolocation: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const page = await context.newPage();

  // =========================
  // Test Data
  // =========================
  await page.goto("https://moodlocation.vercel.app/login");
  await page
    .getByPlaceholder("example@mail.com")
    .fill("vibemaptester@gmail.com");
  await page.locator('input[type="password"]').fill("Bfxrn2547-");
  await page.click('button[type="submit"]');

  await expect(page.getByText("เข้าสู่ระบบสำเร็จ")).toBeVisible({
    timeout: 30000,
  });

  await expect(page.getByText("เข้าสู่ระบบสำเร็จ")).toBeHidden({
    timeout: 15000,
  });

  // =========================
  // เลือกอารมณ์
  // =========================

  await page
    .getByRole("button", {
      name: /มีความสุข/,
    })
    .click();

  // =========================
  // เลือกหมวด
  // =========================

  await page
    .getByRole("heading", {
      name: "สวนสนุก",
    })
    .click();

  // =========================
  // บันทึก 10 สถานที่
  // =========================

  for (let i = 0; i < 10; i++) {
    const viewButton = page
      .getByRole("button", {
        name: "ดูรูปภาพและรีวิว",
      })
      .nth(i);

    await expect(viewButton).toBeVisible({
      timeout: 15000,
    });

    await viewButton.click();

    const heartButton = page.locator("main button").nth(1);

    await expect(heartButton).toBeVisible();

    await heartButton.click();

    // ตรวจสอบว่าบันทึกสำเร็จ
    const successToast = page.getByText(/สำเร็จ|บันทึก/i);

    await expect(successToast).toBeVisible({
      timeout: 5000,
    });

    await expect(successToast).toBeHidden({
      timeout: 10000,
    });
    // กดปุ่มย้อนกลับของระบบ
    const backButton = page.getByRole("button").nth(2);

    await expect(backButton).toBeVisible({
      timeout: 10000,
    });

    await backButton.click();

    // รอจนกลับมาหน้ารายการสถานที่
    await expect(
      page
        .getByRole("button", {
          name: "ดูรูปภาพและรีวิว",
        })
        .first(),
    ).toBeVisible({
      timeout: 30000,
    });
  }
  // เปิดสถานที่ลำดับที่ 11
  const viewButton11 = page
    .getByRole("button", {
      name: "ดูรูปภาพและรีวิว",
    })
    .nth(10);

  await expect(viewButton11).toBeVisible({
    timeout: 30000,
  });

  await viewButton11.click();

  // กดหัวใจ
  const heartButton11 = page.locator("main button").nth(1);

  await expect(heartButton11).toBeVisible();

  await heartButton11.click();
  // =========================
  // ตรวจสอบรายการโปรดเต็ม
  // =========================

  const popup = page.locator(".swal2-popup");

  await expect(popup).toBeVisible();

  await expect(popup).toContainText("บันทึกไม่สำเร็จ!");
  await expect(popup).toContainText("รายการโปรดของคุณเต็มแล้ว");

  await page
    .getByRole("button", {
      name: "OK",
    })
    .click();

  await expect(popup).toBeHidden();

  // =========================
  // Screenshot
  // =========================

  await page.screenshot({
    path: "evidence/TC_6_0_002_FavoriteFull.png",
    fullPage: true,
  });

  await context.close();
});
