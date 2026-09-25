const { test } = require('@playwright/test');
const { updateTestResult } = require('../../googleSheets');

test.afterEach(async ({}, testInfo) => {

  const fileName = testInfo.file.split('\\').pop();

  const match = fileName.match(/TC_\d+_\d+_\d+/);

  if (!match) return;

  const testId = match[0];

  const result =
    testInfo.status === 'passed'
      ? 'PASS'
      : 'FAIL';

  await updateTestResult(testId, result);
});