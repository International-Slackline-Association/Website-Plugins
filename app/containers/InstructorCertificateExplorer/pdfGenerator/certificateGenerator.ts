import TempPDF from './temp.pdf';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { createQRCode } from './qrCode';

const reader = new FileReader();

interface Props {
  id: string;
}

export async function generateCertificate(props: Props) {
  const bytes = await createQRCode('url');

  // const pdfDoc = await PDFDocument.create();

  // // Embed the JPG image bytes and PNG image bytes
  // const pngImage = await pdfDoc.embedPng(bytes);
  // // Get the width/height of the JPG image scaled down to 25% of its original size
  // const jpgDims = pngImage.scale(0.25);

  // // Get the width/height of the PNG image scaled down to 50% of its original size
  // const pngDims = pngImage.scale(0.5);

  // // Add a blank page to the document
  // const page = pdfDoc.addPage();

  // // Draw the PNG image near the lower right corner of the JPG image
  // page.drawImage(pngImage, {
  //   x: page.getWidth() / 2 - pngDims.width / 2 + 75,
  //   y: page.getHeight() / 2 - pngDims.height,
  //   width: pngDims.width,
  //   height: pngDims.height,
  // });

  // // Serialize the PDFDocument to bytes (a Uint8Array)
  // const pdfBytes = await pdfDoc.save();
  // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  // const link = document.createElement('a');
  // link.href = window.URL.createObjectURL(blob);
  // const fileName = 'tempModified';
  // link.download = fileName;
  // link.click();
}
