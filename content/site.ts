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
      "Formal attire. Ceremony, dinner and dancing at Edgewood Country Club. Times are tentative; check the wedding site for updates.",
  },

  venue: {
    name: "Edgewood Country Club",
    // TODO verify street address and ZIP with the club before invitations go out
    street: "100 Churchill Road",
    city: "Pittsburgh",
    region: "PA",
    zip: "15235",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Edgewood+Country+Club+Churchill+PA",
  },

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

  /** null shows "coming soon". */
  registryUrl: null as null | string,

  travel: {
    flying: {
      heading: "Flying in",
      big: "PIT",
      small: "Pittsburgh International",
      body: "About 35–45 minutes to the venue by car, depending on traffic through the tunnels. Rideshare is easy from the airport.",
    },
    driving: {
      heading: "Driving in",
      big: "~3 hr",
      small: "from Columbus via I-70",
      body: "The venue is east of downtown in Churchill. Free parking on site.",
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
    a: "Formal attire (see the guide above). Suits and ties for the gentlemen; dresses that fall below the knee, or other formal wear, for the ladies. September evenings in Pittsburgh can cool off, so a wrap is a good idea.",
  },
  {
    q: "Can I bring a plus-one?",
    a: "Your invitation will list everyone we've saved a seat for. If you're unsure, just ask us.",
  },
  { q: "Are kids welcome?", a: "Details coming soon. Check your invitation." },
  site.registryUrl
    ? {
        q: "Is there a registry?",
        a: "Yes. Honestly, you showing up is the gift.",
        link: { href: site.registryUrl, label: "Open the registry" },
      }
    : { q: "Is there a registry?", a: "Yes, link coming soon. Honestly, you showing up is the gift." },
  {
    q: "Where should I stay?",
    a: "We're setting up a hotel block. Watch the Travel section for the link.",
  },
  {
    q: "Will it be indoors?",
    a: "The reception is indoors at Edgewood. We'll share ceremony details closer to the date.",
  },
];

export const venueAddress = `${site.venue.name}, ${site.venue.street}, ${site.venue.city}, ${site.venue.region} ${site.venue.zip}`;
