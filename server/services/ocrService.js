const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const pdfModule = require('pdf-parse');
const { PDFParse } = pdfModule;
const fs = require('fs');
const path = require('path');
const os = require('os');

const extractTextFromImage = async (filePath) => {
  const tempPath = path.join(
    os.tmpdir(),
    `preprocessed_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`
  );

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let transform = image.grayscale().normalize();

    if (metadata.width && (metadata.width < 1000 || metadata.width > 2000)) {
      transform = transform.resize({ width: 1500, withoutEnlargement: false });
    }

    await transform.toFile(tempPath);

    const { data: { text } } = await Tesseract.recognize(tempPath, 'eng');
    return text;
  } finally {
    if (fs.existsSync(tempPath)) {
      try {
        await fs.promises.unlink(tempPath);
      } catch (err) {
        // Ignore temp file cleanup error
      }
    }
  }
};

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.promises.readFile(filePath);
    let text = '';

    if (PDFParse) {
      const parser = new PDFParse(new Uint8Array(dataBuffer));
      const result = await parser.getText();
      text = result ? (result.text || '') : '';
    } else if (typeof pdfModule === 'function') {
      const data = await pdfModule(dataBuffer);
      text = data ? (data.text || '') : '';
    }

    text = text ? text.trim() : '';

    if (text.length < 20) {
      return '';
    }

    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
};

module.exports = {
  extractTextFromImage,
  extractTextFromPDF,
};