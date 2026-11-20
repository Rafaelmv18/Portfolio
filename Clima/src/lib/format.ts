export type Unit = 'C' | 'F';

/** Date "falsa" em UTC que representa a hora local da cidade. */
const local = (t: number, offset: number) => new Date((t + offset) * 1000);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const hourOf = (t: number, offset: number) => local(t, offset).getUTCHours();

export const hourLabel = (t: number, offset: number) => `${hourOf(t, offset)}h`;

const longFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
export const longDate = (t: number, offset: number) => capitalize(longFmt.format(local(t, offset)));

const shortFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' });
export const weekdayShort = (t: number, offset: number) =>
  capitalize(shortFmt.format(local(t, offset)).replace('.', ''));

export const toUnit = (celsius: number, unit: Unit) => (unit === 'F' ? (celsius * 9) / 5 + 32 : celsius);

export const temp = (celsius: number, unit: Unit) => Math.round(toUnit(celsius, unit));
