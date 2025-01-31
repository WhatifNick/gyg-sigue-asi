import { format } from 'date-fns';
import dayjs from 'dayjs';

export function formatDate(date: any): string {
  if (!date || typeof Date.parse(date) !== 'number') return '';

  const newDate = new Date(date);
  const formattedDate = format(newDate, 'dd-MMM-yyyy');

  return formattedDate;
}

// Dates must be strings in the format 'DD-MMM-YYYY' for the function to work
export const compareDates = (valueA: string | null, valueB: string | null): number => {
  const convertDateToUnix = (date: string | null) => {
    if (date === null || date === '') return null;
    const months: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const dateParts = date?.split('-');
    if (dateParts.length !== 3) return null;

    const year = Number(dateParts[2]);
    const month = months[dateParts[1]] ?? 0;
    const day = Number(dateParts[0]);
    return new Date(year, month, day).getTime();
  };
  const a = convertDateToUnix(valueA);
  const b = convertDateToUnix(valueB);

  if (a === null && b === null) {
    return 0; // Keep the order as is
  }
  if (a === null) {
    return -1; // Place null dates at the end
  }
  if (b === null) {
    return 1; // Place null dates at the beginning
  }
  return a - b; // Compare non-null dates
};

interface DatesForDisplay {
  firstWeek: string;
  secondWeek: string;
}

export const getDatesForDisplay = (startDate: string, endDate: string): DatesForDisplay => {
  const format = (date: any) => dayjs(date).format('DD-MMM');

  const addDays = (date: any, days: number) => {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  };
  const startDateWeek1 = new Date(startDate);
  const endDateWeek1 = addDays(startDateWeek1, 6);
  const startDateWeek2 = addDays(startDateWeek1, 7);
  const endDateWeek2 = endDate ? new Date(endDate) : addDays(startDateWeek1, 13);
  return {
    firstWeek: ` ${format(startDateWeek1)} to ${format(endDateWeek1)}`,
    secondWeek: ` ${format(startDateWeek2)} to ${format(endDateWeek2)}`,
  };
};
