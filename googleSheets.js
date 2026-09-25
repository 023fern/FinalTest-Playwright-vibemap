const { google } = require('googleapis');

const SPREADSHEET_ID = '1cpTnHCUrnQb0NAXbcRoowKOV0cyIS4llke4jnuiuHcw';
const SHEET_NAME = 'Test caseMFT';

async function updateTestResult(testId, result) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'project-testing-playwright-ce31b59d8b2c.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:I`,
  });

  const rows = response.data.values || [];

  const rowIndex = rows.findIndex(
    row => row[0] && row[0].trim() === testId
  );

  if (rowIndex === -1) {
    console.log(`ไม่พบ Test ID: ${testId}`);
    return;
  }

  const actualRow = rowIndex + 1;

  const runDate = new Date().toLocaleString('th-TH');

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
        {
          range: `${SHEET_NAME}!I${actualRow}`,
          values: [[result]],
        },
        {
          range: `${SHEET_NAME}!J${actualRow}`,
          values: [[runDate]],
        },
      ],
    },
  });

  console.log(`${testId} => ${result}`);
}

module.exports = { updateTestResult };