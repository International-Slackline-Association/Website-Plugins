import moment from 'moment';

// tslint:disable-next-line: max-line-length
const k = 'AIzaSyD1d4S8fcj' + '_' + 'UEcRnxuQqpJypb9slGV9XNw'; // The key is limiting actions only to this spreadsheet. Don't bother using it
// tslint:disable-next-line: max-line-length
const url = `https://sheets.googleapis.com/v4/spreadsheets/16cp9iRy1Rs8uOU_UZ9ouJGkhQ_0IiySmF5UNCaorJHM/values/Warnings?key=${k}`;

interface SheetResponse {
  values: SheetItem[];
}

type SheetItem = string[];

export interface EquipmentWarningItem {
  _id: string;
  status: string;
  dateString: string;
  date: Date;
  productType: string;
  name: string;
  manufacturer: string;
  inProduction: boolean;
  description: string;
  solution: string;
  image: string;
  link1: string;
  link2: string;
}

let data: EquipmentWarningItem[];

export async function getStatuses() {
  if (!data) {
    await loadData();
  }
  const statuses = data.map(i => i.status).sort((a, b) => (a < b ? -1 : 1));
  const distinct = ['All Statuses'].concat(Array.from(new Set(statuses)));
  return distinct;
}

export async function getManufacturers() {
  if (!data) {
    await loadData();
  }
  const manufacturers = data
    .map(i => i.manufacturer)
    .sort((a, b) => (a < b ? -1 : 1));
  const distinct = ['All Manufacturers'].concat(
    Array.from(new Set(manufacturers)),
  );
  return distinct;
}

export async function queryData(status?: string, manufacturer?: string) {
  if (!data) {
    await loadData();
  }
  let list = data;
  if (status && !status.includes('All')) {
    list = data.filter(
      i => i.status.toLowerCase().trim() === status.toLowerCase().trim(),
    );
  }
  if (manufacturer && !manufacturer.includes('All')) {
    list = data.filter(
      i =>
        i.manufacturer.toLowerCase().trim() ===
        manufacturer.toLowerCase().trim(),
    );
  }

  return list;
}

async function loadData() {
  const resp = await getSpreadsheetData();
  const items = parseSheetResponse(resp);
  data = items.sort((a, b) => (a.date < b.date ? -1 : 1));
}

function parseSheetResponse(resp: SheetResponse): EquipmentWarningItem[] {
  const values = resp.values.slice(1); // skip columns
  const items: EquipmentWarningItem[] = [];
  for (const value of values) {
    const date = moment(value[1]?.trim(), 'DD.MM.YY');
    items.push({
      _id: `${value[2].trim()}-${value[3].trim()}-${value[4].trim()}-${value[5].trim()}`,
      status: value[0]?.trim(),
      dateString: date.format('DD/MM/YYYY'),
      date: date.toDate(),
      productType: value[2]?.trim(),
      name: value[3]?.trim(),
      manufacturer: value[4]?.trim(),
      inProduction: value[5]?.trim() === 'Yes',
      description: value[6]?.trim(),
      solution: value[7]?.trim(),
      image: value[8]?.trim(),
      link1: value[9]?.trim(),
      link2: value[10]?.trim(),
    });
  }
  return items;
}

async function getSpreadsheetData(): Promise<SheetResponse> {
  const data = await fetch(url).then(response => response.json());
  return data;
}
