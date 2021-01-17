import PDF_EN from './trainerC-en.pdf';
import PDF_ES from './trainerC-es.pdf';

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import { embedQRCodeToPDF } from '../qrCode';

interface Props {
  fullname: string;
  date: string;
  qrCode: ArrayBuffer;
  language?: string;
}

export const TrainerCPDFs = { en: PDF_EN, es: PDF_ES };

export async function generateTrainerC(props: Props): Promise<PDFDocument> {
  const language = props.language || 'en';
  const blankPDF = TrainerCPDFs[language] || TrainerCPDFs.en;

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
      y: pageSize.height - 202 - font.heightAtSize(fontSize),
    },
    date: { x: 480, y: pageSize.height - 360 - font.heightAtSize(fontSize) },
    qrCode: {
      x: 750 - qrImage.width / 2,
      y: pageSize.height - 100 - qrImage.height,
    },
  };
  return allLanguages;
}
