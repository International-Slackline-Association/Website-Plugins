import PDF_EN from './rigger-en.pdf';

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import { embedQRCodeToPDF } from 'app/pages/InstructorCertificate/pdfGenerator/qrCode';

// With promises

interface Props {
  fullname: string;
  date: string;
  qrCode: ArrayBuffer;
  language?: string;
}

export const RiggerPDFs = { en: PDF_EN };

export async function generateRigger(props: Props): Promise<PDFDocument> {
  const language = props.language || 'en';
  const blankPDF = RiggerPDFs[language] || RiggerPDFs.en;

  const res = await fetch(blankPDF);
  const existingPdfBytes = await res.arrayBuffer();

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const qrImage = await pdfDoc.embedPng(props.qrCode);

  const pages = pdfDoc.getPages();
  const page = pages[0];

  const fontSize = 16;
  const name = props.fullname.toUpperCase();
  const date = props.date.toUpperCase();

  const positions = modificationPositions(
    language,
    page.getSize(),
    font,
    fontSize,
    qrImage,
    { name: name },
  );

  page.drawText(name, {
    x: positions.name.x,
    y: positions.name.y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText(date, {
    x: positions.date.x,
    y: positions.date.y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  await embedQRCodeToPDF(pdfDoc, props.qrCode, font, {
    x: positions.qrCode.x,
    y: positions.qrCode.y,
  });

  return pdfDoc;
}

function modificationPositions(
  language: string,
  pageSize: { width: number; height: number },
  font: PDFFont,
  fontSize: number,
  qrImage: PDFImage,
  meta: { name: string },
) {
  const allLanguages = {
    name: {
      x: pageSize.width / 2 - font.widthOfTextAtSize(meta.name, fontSize) / 2,
      y: pageSize.height - 189 - font.heightAtSize(fontSize),
    },
    date: { x: 397, y: pageSize.height - 390 - font.heightAtSize(fontSize) },
    qrCode: {
      x: 750 - qrImage.width / 2,
      y: pageSize.height - 100 - qrImage.height,
    },
  };
  return allLanguages;
}
