import "server-only";
import postgres from "postgres";

// One client per server instance. Supabase's pooler (port 6543, transaction mode)
// does not support prepared statements, so they're turned off.
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export function db() {
  if (!globalForDb.sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    globalForDb.sql = postgres(url, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      ssl: local ? false : "require",
    });
  }
  return globalForDb.sql;
}

export type RsvpRow = {
  id: string;
  name: string;
  attending: boolean;
  party_size: number;
  meal: string | null;
  song: string | null;
  note: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  created_at: Date;
  updated_at: Date;
};

export const RSVP_COLUMNS = [
  "id",
  "name",
  "attending",
  "party_size",
  "meal",
  "song",
  "note",
  "phone",
  "address_street",
  "address_city",
  "address_state",
  "address_zip",
  "created_at",
  "updated_at",
] as const;
