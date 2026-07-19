// services/pdfExtractor.js
// Converts a PDF buffer into plain text using pdf2json
import { createRequire } from "module";
const PDFParser = createRequire(import.meta.url)("pdf2json");

/**
 * Takes a PDF file buffer → returns all text as a string
 * @param {Buffer} pdfBuffer - raw bytes of the uploaded PDF
 * @returns {Promise<string>} extracted text
 */
async function extractTextFromPdf(pdfBuffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    let settled = false;

    const onError = errData => {
      if (settled) return;
      settled = true;
      const msg = errData?.parserError || errData || "Unknown pdf2json error";
      reject(new Error(String(msg)));
    };

    const safeDecode = str => {
      try { return decodeURIComponent(str); } catch { return str; }
    };

    const onReady = pdfData => {
      if (settled) return;
      settled = true;
      try {
        const pages = pdfData?.Pages || pdfData?.formImage?.Pages || [];
        const fullText = pages
          .map(page =>
            (page.Texts || [])
              .map(textObj =>
                (textObj.R || []).map(r => safeDecode(r.T || "")).join("")
              )
              .join(" ")
          )
          .join("\n");
        resolve(fullText.trim());
      } catch (err) {
        reject(err);
      }
    };

    pdfParser.on("pdfParser_dataError", onError);
    pdfParser.on("pdfParser_dataReady", onReady);

    try {
      pdfParser.parseBuffer(pdfBuffer);
    } catch (err) {
      // parseBuffer may throw synchronously for invalid inputs
      if (!settled) {
        settled = true;
        reject(err);
      }
    }
  });
}

export { extractTextFromPdf };
