import TempPDF from './temp.pdf';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createQRCode } from 'containers/InstructorCertificateExplorer/pdfGenerator/qrCode';
import { RiggerItem } from '../spreadsheet';
import { generateRigger, RiggerPDFs } from './rigger/riggerGenerator';
const latinize = require('latinize');

interface RiggerCertificateProps {
  rigger: RiggerItem;
  language?: string;
}

export function availableLanguages() {
  return Object.keys(RiggerPDFs);
}

export async function generateRiggerCertificate(props: RiggerCertificateProps) {
  const bytes = await createQRCode('tinyurl.com/toeucxy');
  const rigger = props.rigger;
  const fullName = latinize(`${rigger.firstname} ${rigger.name}`);

  const pdf = await generateRigger({
    date: rigger.riggerDate,
    fullname: fullName,
    qrCode: bytes,
    language: props.language,
  });

  const fileName = `${fullName}_Certificate`;
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
