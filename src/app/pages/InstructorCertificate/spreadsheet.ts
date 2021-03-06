import moment from 'moment';

// tslint:disable-next-line: max-line-length
const k = 'AIzaSyD1d4S8fcj' + '_' + 'UEcRnxuQqpJypb9slGV9XNw'; // The key is limiting actions only to this spreadsheet. Don't bother using it
// tslint:disable-next-line: max-line-length
const url = `https://sheets.googleapis.com/v4/spreadsheets/10fE6gHsAxGc_4p0Dr-1KgTKdB0Cxv_-oeWfonAdrfeE/values/Masterlist?key=${k}`;

interface SheetResponse {
  values: SheetItem[];
}

type SheetItem = string[];

export interface InstructorItem {
  id: string;
  name: string;
  firstname: string;
  country: string;
  level: string;
  date: string;
  expiresAt: string;
}

let instructors: InstructorItem[];

export async function preLoadData() {
  if (!instructors) {
    await loadInstructors();
  }
}

export async function getCountries() {
  if (!instructors) {
    await loadInstructors();
  }
  const countries = instructors
    .map(i => i.country)
    .sort((a, b) => (a < b ? -1 : 1));
  const distinctCountries = Array.from(new Set(countries));
  return distinctCountries;
}

export async function queryInstructorsByCountry(country: string) {
  if (!instructors) {
    await loadInstructors();
  }
  const foundInstructors = instructors.filter(
    i => i.country.toLowerCase().trim() === country.toLowerCase().trim(),
  );
  return !foundInstructors ? null : foundInstructors;
}

export async function queryInstructor(query: string) {
  if (!instructors) {
    await loadInstructors();
  }
  let foundInstructor = queryInstructorById(query);
  if (!foundInstructor) {
    foundInstructor = queryInstructorByName(query);
  }
  return !foundInstructor ? null : foundInstructor;
}

function queryInstructorById(id: string) {
  const found = instructors.find(
    i => i.id.toLowerCase().trim() === id.toLowerCase().trim(),
  );
  return found;
}

function queryInstructorByName(name: string) {
  const found = instructors.find(
    i =>
      `${i.firstname.toLowerCase()} ${i.name.toLowerCase()}` ===
      name.toLowerCase().trim(),
  );
  return found;
}

async function loadInstructors() {
  const resp = await getSpreadsheetData();
  const items = parseSheetResponse(resp).filter(i => i.level?.length > 0);
  instructors = items;
}

function parseSheetResponse(resp: SheetResponse): InstructorItem[] {
  const values = resp.values.slice(1); // skip columns
  const items: InstructorItem[] = [];
  for (const value of values) {
    items.push({
      id: value[0],
      name: value[1].trim(),
      firstname: value[2].trim(),
      country: value[5].trim(),
      level: value[6].trim(),
      date: moment(value[11]?.trim(), 'DD.MM.YY').format('DD/MM/YYYY'),
      expiresAt: moment(value[11]?.trim(), 'DD.MM.YY')
        .add(3, 'years')
        .format('DD/MM/YYYY'),
    });
  }
  return items;
}

async function getSpreadsheetData(): Promise<SheetResponse> {
  const data = await fetch(url).then(response => response.json());
  return data;
}
