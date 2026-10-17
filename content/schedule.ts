// PLACEHOLDER TIMES. Tentative run of show (Eastern time) for the wedding-day live panel.
// Update these once the real times are set. "24:00" means midnight at the end of the day.

export type ScheduleItem = { t: string; title: string; note: string };

export const SCHEDULE: ScheduleItem[] = [
  { t: "16:30", title: "Guests arrive", note: "At St. Stanislaus Kostka Church. Phones on silent." },
  { t: "17:00", title: "Mass", note: "The main event. Tissues encouraged." },
  { t: "18:00", title: "On to Edgewood", note: "About 20 minutes east to Edgewood Country Club." },
  { t: "18:30", title: "Cocktail hour", note: "Cocktails and hors d'oeuvres while we take photos." },
  { t: "19:30", title: "Dinner", note: "Find your table. Champagne is on its way." },
  { t: "20:45", title: "First dance", note: "Then the floor is yours." },
  { t: "21:00", title: "Dancing", note: "The dance floor is open." },
  { t: "23:30", title: "Last call", note: "One more song. Maybe two." },
  { t: "24:00", title: "Send-off", note: "Thank you for celebrating with us." },
];

/** The live panel shows itself between these times on the wedding day (Eastern). */
export const LIVE_WINDOW = { start: "12:00", end: "26:00" };
/** Range of the "Preview the night" scrubber, and where the preview opens. */
export const PREVIEW = { min: "16:00", max: "24:30", openAt: "18:45" };
