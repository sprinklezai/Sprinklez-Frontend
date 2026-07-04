const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const KEY_PATH = path.resolve(__dirname, "..", process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "./config/service-account.json");

function getDriveClient() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(
      `Google service account key not found at ${KEY_PATH}. See README section 3 for setup.`
    );
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return google.drive({ version: "v3", auth });
}

/**
 * Downloads a Drive file's binary content into a Buffer.
 * Works for a real .xlsx file uploaded to Drive (not a native Google Sheet).
 * If you use a native Google Sheet instead, swap this for files.export
 * with mimeType 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.
 */
async function downloadFileBuffer(fileId) {
  const drive = getDriveClient();

  // Detect whether this is a native Google Sheet or an uploaded .xlsx
  const meta = await drive.files.get({ fileId, fields: "mimeType, name" });

  const isGoogleSheet = meta.data.mimeType === "application/vnd.google-apps.spreadsheet";

  const res = isGoogleSheet
    ? await drive.files.export(
        { fileId, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { responseType: "arraybuffer" }
      )
    : await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "arraybuffer" }
      );

  return { buffer: Buffer.from(res.data), fileName: meta.data.name };
}

module.exports = { downloadFileBuffer };
