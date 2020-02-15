import TempPDF from './temp.pdf';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { createQRCode } from 'containers/InstructorCertificateExplorer/pdfGenerator/qrCode';
import { RiggerItem } from '../spreadsheet';
import { generateRigger } from './rigger/riggerGenerator';

interface RiggerCertificateProps {
  rigger: RiggerItem;
  language?: string;
}

export async function generateRiggerCertificate(props: RiggerCertificateProps) {
  const bytes = await createQRCode(
    'data.slacklineinternational.org/education/certificates/',
  );
  const rigger = props.rigger;

  const pdf = await generateRigger({
    date: rigger.riggerDate,
    fullname: `${rigger.firstname} ${rigger.name}`,
    qrCode: bytes,
    language: props.language,
  });

  const fileName = `${rigger.firstname} ${rigger.name}_Certificate`;
  await downloadPDF(pdf, fileName);
}

async function downloadPDF(pdf: PDFDocument, fileName: string) {
  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
