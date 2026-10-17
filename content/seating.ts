// Fill in the week of the wedding and flip READY to true.
// While READY is false the page shows demo copy ("Try Evan to see how it works").
// Numeric table names ("1", "12") display as "Table 12"; anything else displays as "You're at the Head table".

export const READY = false;

export type Table = { table: string; guests: string[] };

export const SEATING: Table[] = [
  { table: "Head table", guests: ["Evan", "Remy"] },
  // { table: "1", guests: ["First Last", "First Last"] },
];
