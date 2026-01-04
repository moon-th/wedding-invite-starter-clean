const SHEET_NAME = 'Sheet1'; // 시트 탭 이름
const MAX_ROWS = 100; // 최근 N개만 응답

function buildResponse(body, status) {
  const out = ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
  // CORS: allow browser access
  out.setHeader('Access-Control-Allow-Origin', '*');
  out.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  out.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // NOTE: GAS는 status code 제어가 제한적이라 body로 ok/error를 내려줍니다.
  return out;
}

// GET: 방명록 목록 조회
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return buildResponse({ ok: true, rows: [] }, 200);

  const values = sheet.getDataRange().getValues(); // [ [timestamp, name, password, message, ip], ... ]
  values.shift(); // 첫 줄 헤더 제거

  const rows = values
    .slice(-MAX_ROWS)
    .map(function (r) {
      return {
        timestamp: r[0],
        name: r[1],
        message: r[3],
      };
    });

  return buildResponse({ ok: true, rows: rows }, 200);
}

// POST: 방명록 작성
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}'); // { name, message, password? }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return buildResponse({ ok: false, error: 'sheet not found' }, 500);

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.password || '',
      data.message || '',
      (e && e.parameter && e.parameter.ip) || '',
    ]);

    return buildResponse({ ok: true }, 200);
  } catch (err) {
    return buildResponse({ ok: false, error: String(err) }, 500);
  }
}
