import { site } from "@/content/site";

// Labels for the wedding date, shared by the tab pages. Noon avoids any timezone edge.
const d = new Date(`${site.date}T12:00:00`);
export const dateLong = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
export const dateFull = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
export const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
export const dateShort = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
