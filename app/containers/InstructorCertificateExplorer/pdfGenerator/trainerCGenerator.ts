import TempPDF from './temp.pdf';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode'

// With promises


interface Props {
  name: string;
}

export async function generateTrainerC(props: Props) {
  const res = await fetch(TempPDF);
  const existingPdfBytes = await res.arrayBuffer();

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Draw a string of text diagonally across the first page
  firstPage.drawText('SOME CONTEST', {
    x: 373,
    y: height - 264 - 15,
    size: 15,
    font: helveticaFont,
    color: rgb(0.26, 0.25, 0.25),
  });
  firstPage.drawText('SOME COUNTRY', {
    x: 373,
    y: height - 282 - 15,
    size: 15,
    font: helveticaFont,
    color: rgb(0.26, 0.25, 0.25),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  const fileName = 'tempModified';
  link.download = fileName;
  link.click();
}
