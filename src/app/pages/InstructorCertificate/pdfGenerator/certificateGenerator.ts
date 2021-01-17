import { PDFDocument } from 'pdf-lib';
import { createQRCode } from './qrCode';
import { InstructorItem } from '../spreadsheet';
import { generateTrainerC, TrainerCPDFs } from './trainerC/trainerCGenerator';
import { generateTrainerB, TrainerBPDFs } from './trainerB/trainerBGenerator';
const latinize = require('latinize');

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

export function availableLanguages(instructor: InstructorItem) {
  if (instructor.level.includes('Instructor C')) {
    return Object.keys(TrainerCPDFs);
  } else if (instructor.level.includes('Instructor B')) {
    return Object.keys(TrainerBPDFs);
  }
  return [];
}
export async function generateInstructorCertificate(
  props: InstructorCertificateProps,
) {
  const bytes = await createQRCode('tinyurl.com/toeucxy');
  const instructor = props.instructor;
  const fullName = latinize(`${instructor.firstname} ${instructor.name}`);

  let pdf: PDFDocument | undefined;
  if (instructor.level.includes('Instructor C')) {
    pdf = await generateTrainerC({
      date: instructor.date,
      fullname: fullName,
      qrCode: bytes,
      language: props.language,
    });
  } else if (instructor.level.includes('Instructor B')) {
    pdf = await generateTrainerB({
      date: instructor.date,
      fullname: fullName,
      qrCode: bytes,
      language: props.language,
    });
  }
  if (pdf) {
    const fileName = `${fullName}_Certificate`;
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
