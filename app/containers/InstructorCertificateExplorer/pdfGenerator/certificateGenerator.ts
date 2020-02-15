import TempPDF from './temp.pdf';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { createQRCode } from './qrCode';
import { InstructorItem } from '../spreadsheet';
import { generateTrainerC } from './trainerC/trainerCGenerator';
import { generateTrainerB } from './trainerB/trainerBGenerator';

interface InstructorCertificateProps {
  instructor: InstructorItem;
  language?: string;
}
export function canGenerateCertificate(instructor: InstructorItem) {
  if (
    instructor.level.includes('Instructor B') ||
    instructor.level.includes('Instructor C')
  ) {
    return true;
  }
  return false;
}
export async function generateInstructorCertificate(
  props: InstructorCertificateProps,
) {
  const bytes = await createQRCode(
    'data.slacklineinternational.org/education/certificates/',
  );
  const instructor = props.instructor;
  let pdf: PDFDocument | undefined;
  if (instructor.level.includes('Instructor C')) {
    pdf = await generateTrainerC({
      date: instructor.valid,
      fullname: `${instructor.firstname} ${instructor.name}`,
      qrCode: bytes,
      language: props.language,
    });
  } else if (instructor.level.includes('Instructor B')) {
    pdf = await generateTrainerB({
      date: instructor.valid,
      fullname: `${instructor.firstname} ${instructor.name}`,
      qrCode: bytes,
      language: props.language,
    });
  }
  if (pdf) {
    const fileName = `${instructor.firstname} ${instructor.name}_Certificate`;
    await downloadPDF(pdf, fileName);
  }
}

async function downloadPDF(pdf: PDFDocument, fileName: string) {
  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
