import QRCode from 'qrcode';
import { PDFDocument, PDFFont, rgb } from 'pdf-lib';

export async function createQRCode(url: string): Promise<ArrayBuffer> {
  return QRCode.toDataURL(url, {
    width: 50,
    margin: 0,
    errorCorrectionLevel: 'H',
  })
    .then(async dataUrl => {
      const res = await fetch(dataUrl);
      const bytes = await res.arrayBuffer();
      return bytes;
    })
    .catch(err => {
      console.error(err);
      return null;
    });
}

export async function embedQRCodeToPDF(
  pdfDoc: PDFDocument,
  bytes: ArrayBuffer,
  font: PDFFont,
  point: { x: number; y: number },
) {
  const qrImage = await pdfDoc.embedPng(bytes);
  const page = pdfDoc.getPages()[0];

  page.drawImage(qrImage, {
    x: point.x,
    y: point.y,
    width: qrImage.width,
    height: qrImage.height,
  });

  page.drawText(
    'You can verify this certificate by scanning the QR Code above',
    {
      x: point.x,
      y: point.y - 10,
      maxWidth: qrImage.width,
      lineHeight: 5,
      size: 4,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
}
