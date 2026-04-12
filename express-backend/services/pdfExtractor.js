// services/pdfExtractor.js
// Converts a PDF buffer into plain text
// Port of: backend/services/pdf_extractor.py (PyMuPDF → pdf-parse)

// pdf-parse v2 uses a class-based API:
//   new PDFParse({ data: buffer }) instead of pdfParse(buffer)
import { PDFParse } from "pdf-parse";

/**
 * Takes a PDF file buffer → returns all text as a string
 * @param {Buffer} pdfBuffer - raw bytes of the uploaded PDF
 * @returns {Promise<string>} extracted text
 */
async function extractTextFromPdf(pdfBuffer) {
  const parser = new PDFParse({ data: pdfBuffer });
  const result = await parser.getText();
  return result.text.trim();
}

export { extractTextFromPdf };
