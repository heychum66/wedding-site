// Everything on the site that Evan & Remy might want to change lives here.
// Edit, commit, push: Vercel redeploys on its own.

export type Link = { href: string; label: string };

export const site = {
  names: { first: "Evan", second: "Remy" },

  /** The wedding day, as a calendar date in the ceremony timezone. */
  date: "2027-09-18",
  timezone: "America/New_York",
  /** What the countdown counts to. Ceremony time is TBD, so this is 5pm Eastern for now. */
  ceremonyStart: "2027-09-18T17:00:00-04:00",
  /** Used for the Google / Outlook / Apple calendar entries. Tentative. */
  event: {
    title: "Evan & Remy's Wedding",
    start: "2027-09-18T16:30:00-04:00",
    end: "2027-09-19T00:00:00-04:00",
    description:
      "Mass at St. Stanislaus Kostka Church (57 21st Street, Pittsburgh), then the reception at Edgewood Country Club (100 Churchill Road). Formal attire. Times are tentative; check the wedding site for updates.",
  },

  /** First stop: the Mass. Times are TBD until the parish confirms. */
  ceremony: {
    label: "The Mass",
    name: "St. Stanislaus Kostka Church",
    street: "57 21st Street",
    city: "Pittsburgh",
    region: "PA",
    zip: "15222",
    area: "In the Strip District",
    time: "TBD",
    parking: "Street parking and pay lots around 21st & Smallman Streets. Spots fill up on Saturdays, so give yourself a few extra minutes.",
  },
  /** Then: cocktails, dinner and dancing. */
  reception: {
    label: "The reception",
    name: "Edgewood Country Club",
    street: "100 Churchill Road",
    city: "Pittsburgh",
    region: "PA",
    zip: "15235",
    area: "In Churchill, just east of the city",
    parking: "Free parking in the club's lot.",
    /** Rows on The Day tab. */
    schedule: [
      { t: "TBD", what: "Cocktail hour", note: "Drinks and passed hors d'oeuvres." },
      { t: "TBD", what: "Dinner & dancing", note: "A seated dinner, then an open dance floor." },
      { t: "Late", what: "Last call", note: "We'll be on the dance floor." },
    ],
  },
  /** Getting from the church to the club. */
  between: "About 20 minutes by car, east on the Parkway (I-376).",

  /** RSVPs close at the end of this day (Eastern). The form switches to a "closed" message after. */
  rsvpDeadline: "2027-08-01T23:59:59-04:00",
  rsvpDeadlineLabel: "By the first of August",

  /** Placeholders until the menu is set. These show in the RSVP dropdown and the admin meal counts. */
  meals: ["Beef", "Chicken", "Vegetarian", "Kids meal"],
  maxPartySize: 5,
  /** RSVP asks for phone + mailing address. false = optional, true = guests must fill them in. */
  requireContact: false,

  /**
   * The text message behind each "Text invite" button at /admin. {first} becomes the guest's first
   * name, {name} their full name as it appears in your spreadsheet, {link} their personal RSVP link.
   */
  inviteText:
    "Hi {first}! Evan and Remy are getting married on September 18, 2027 in Pittsburgh, and we'd love for you to be there. Here's your invitation. Kindly RSVP by August 1: {link}",

  /** null shows "coming soon". Fill in like: { name: "Hotel Name", url: "https://…", code: "EVANREMY", bookBy: "August 15" } */
  hotelBlock: null as null | { name: string; url: string; code?: string; bookBy?: string },

  /**
   * Shown on the Registry tab, one card each. Empty shows "coming soon". Fill in like:
   * { name: "Zola", url: "https://www.zola.com/registry/…", note: "Home goods and a honeymoon fund" }
   */
  registries: [] as { name: string; url: string; note?: string }[],
  /** The note at the top of the Registry tab. */
  registryNote:
    "Between the two of us (and three cats), our home is officially full. Your presence is truly all we want, but if you'd like to celebrate with a gift, we'd love help making memories instead: our honeymoon, a few special dinners, and the trips we've always talked about.",

  travel: {
    flying: {
      heading: "Flying in",
      big: "PIT",
      small: "Pittsburgh International",
      body: "About 25 minutes to the church and 35–45 to Edgewood. Rideshare is easy from the airport.",
    },
    driving: {
      heading: "Driving in",
      big: "~3 hr",
      small: "from Columbus via I-70",
      body: "Both stops are a short drive apart: the church in the city, Edgewood about 20 minutes east.",
    },
    weekend: {
      heading: "Make a weekend of it",
      items: [
        "Ride the Duquesne Incline up Mount Washington for the skyline",
        "Eat your way through the Strip District",
        "Walk the Roberto Clemente Bridge to PNC Park",
        "Phipps Conservatory in Oakland",
        "A Primanti Bros. sandwich, fries inside, no debate",
      ],
    },
  },
};

export type Faq = { q: string; a: string; link?: Link };

export const faq: Faq[] = [
  {
    q: "What should I wear?",
    a: "Formal attire (see the Attire tab). Suits and ties for the gentlemen; dresses that fall below the knee, or other formal wear, for the ladies. September evenings in Pittsburgh can cool off, so a wrap is a good idea.",
  },
  {
    q: "Can I bring a plus-one?",
    a: "Your invitation will list everyone we've saved a seat for. If you're unsure, just ask us.",
  },
  { q: "Are kids welcome?", a: "Details coming soon. Check your invitation." },
  {
    q: "Is there a registry?",
    a: site.registries.length
      ? "Yes, it's on the Registry tab. Honestly, you showing up is the gift."
      : "Yes, it'll be on the Registry tab soon. Honestly, you showing up is the gift.",
    link: { href: "/registry", label: "Go to the registry" },
  },
  {
    q: "Will there be food?",
    a: "Yes! Hors d'oeuvres during cocktail hour, then a seated dinner. You'll choose your entrée when you RSVP.",
  },
  {
    q: "Will there be a bar?",
    a: "Yes, an open bar at the reception. Please drink responsibly and plan a safe ride home.",
  },
  {
    q: "Where should I stay?",
    a: "We're setting up a hotel block. The link will be on the Travel tab.",
  },
  {
    q: "Will it be indoors?",
    a: "Yes, both are indoors: the Mass at St. Stanislaus Kostka Church in the Strip District, then the reception at Edgewood Country Club.",
  },
];

const fullAddress = (v: { name: string; street: string; city: string; region: string; zip: string }) =>
  `${v.name}, ${v.street}, ${v.city}, ${v.region} ${v.zip}`;
export const ceremonyAddress = fullAddress(site.ceremony);
