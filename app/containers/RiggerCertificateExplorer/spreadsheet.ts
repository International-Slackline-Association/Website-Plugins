// tslint:disable-next-line: max-line-length
const k = 'AIzaSyD1d4S8fcj' + '_' + 'UEcRnxuQqpJypb9slGV9XNw'; // The key is limiting actions only to this spreadsheet. Don't bother using it
// tslint:disable-next-line: max-line-length
const url = `https://sheets.googleapis.com/v4/spreadsheets/10fE6gHsAxGc_4p0Dr-1KgTKdB0Cxv_-oeWfonAdrfeE/values/Masterlist?key=${k}`;

interface SheetResponse {
  values: SheetItem[];
}

type SheetItem = string[];

export interface RiggerItem {
  id: string;
  name: string;
  firstname: string;
  country: string;
  rigger: string;
  valid: string;
  riggerDate: string;
}

let riggers: RiggerItem[];

export async function preLoadData() {
  if (!riggers) {
    await loadRiggers();
  }
}

export async function getCountries() {
  if (!riggers) {
    await loadRiggers();
  }
  const countries = riggers
    .map(i => i.country)
    .sort((a, b) => (a < b ? -1 : 1));
  const distinctCountries = Array.from(new Set(countries));
  return distinctCountries;
}

export async function queryRiggersByCountry(country: string) {
  if (!riggers) {
    await loadRiggers();
  }
  const found = riggers.filter(
    i => i.country.toLowerCase().trim() === country.toLowerCase().trim(),
  );
  return !found ? null : found;
}

export async function queryRigger(query: string) {
  if (!riggers) {
    await loadRiggers();
  }
  let found = queryRiggerById(query);
  if (!found) {
    found = queryRiggerByName(query);
  }
  return !found ? null : found;
}

function queryRiggerById(id: string) {
  const found = riggers.find(
    i => i.id.toLowerCase().trim() === id.toLowerCase().trim(),
  );
  return found;
}

function queryRiggerByName(name: string) {
  const found = riggers.find(
    i =>
      `${i.firstname.toLowerCase()} ${i.name.toLowerCase()}` ===
      name.toLowerCase().trim(),
  );
  return found;
}

async function loadRiggers() {
  const resp = await getSpreadsheetData();
  const items = parseSheetResponse(resp).filter(i => i.rigger.length > 0);
  riggers = items;
}

function parseSheetResponse(resp: SheetResponse): RiggerItem[] {
  const values = resp.values.slice(1); // skip columns
  const items: RiggerItem[] = [];
  for (const value of values) {
    items.push({
      id: value[0],
      name: value[1].trim(),
      firstname: value[2].trim(),
      country: value[5].trim(),
      rigger: value[7]?.trim(),
      valid: value[10]?.trim(),
      riggerDate: value[12]?.trim(),
    });
  }
  return items;
}

async function getSpreadsheetData(): Promise<SheetResponse> {
  const data = await fetch(url).then(response => response.json());
  return data;
}
