// tslint:disable-next-line: max-line-length
const k = 'AIzaSyD1d4S8fcj' + '_' + 'UEcRnxuQqpJypb9slGV9XNw'; // The key is limiting actions only to this spreadsheet. Don't bother using it
// tslint:disable-next-line: max-line-length
const url = `https://sheets.googleapis.com/v4/spreadsheets/1y8WYw4p-xwILDrC0hDajG1DBY_ncItmwWsPEWMbwIDc/values/Masterlist?key=${k}`;

interface SheetResponse {
  values: SheetItem[];
}

type SheetItem = string[];

export interface GearItem {
  picture1: string;
  picture2: string;
  brand: string;
  modelName: string;
  modelVersion: string;
  releaseYear: string;
  modelDescription: string;
  productLink: string;
  manualLink: string;
  testingLab: string;
  testDate: string;
  productType: string;
  standard: string;
  standardVersion: string;
}

let gears: GearItem[];

export async function getBrands() {
  if (!gears) {
    await loadGears();
  }
  const brands = gears.map(i => i.brand).sort((a, b) => (a < b ? -1 : 1));
  const distinct = Array.from(new Set(brands));
  return distinct;
}

export async function getProductTypes() {
  if (!gears) {
    await loadGears();
  }
  const productTypes = gears
    .map(i => i.productType)
    .sort((a, b) => (a < b ? -1 : 1));
  const distinct = Array.from(new Set(productTypes));
  return distinct;
}

export async function queryGears(brand?: string, productType?: string) {
  if (!gears) {
    await loadGears();
  }
  let list = gears;
  if (brand && !brand.includes('All')) {
    list = gears.filter(
      i => i.brand.toLowerCase().trim() === brand.toLowerCase().trim(),
    );
  }
  if (productType && !productType.includes('All')) {
    list = gears.filter(
      i => i.productType.toLowerCase().trim() === productType.toLowerCase().trim(),
    );
  }

  return list;
}


async function loadGears() {
  const resp = await getSpreadsheetData();
  const items = parseSheetResponse(resp);
  gears = items;
}

function parseSheetResponse(resp: SheetResponse): GearItem[] {
  const values = resp.values.slice(1); // skip columns
  const items: GearItem[] = [];
  for (const value of values) {
    items.push({
      picture1: value[0],
      picture2: value[1],
      brand: value[2],
      modelName: value[3],
      modelVersion: value[4],
      releaseYear: value[5],
      modelDescription: value[6],
      productLink: value[7],
      manualLink: value[8],
      testingLab: value[9],
      testDate: value[10],
      productType: value[11],
      standard: value[12],
      standardVersion: value[3],
    });
  }
  return items;
}

async function getSpreadsheetData(): Promise<SheetResponse> {
  const data = await fetch(url).then(response => response.json());
  return data;
}
