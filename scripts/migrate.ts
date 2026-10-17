// Runs sql/schema.sql against DATABASE_URL.
// Usage: npm run migrate   (reads .env.local, then .env)
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

for (const f of [".env.local", ".env"]) {
  if (existsSync(f)) process.loadEnvFile(f);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}

const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const sql = postgres(url, { prepare: false, max: 1, ssl: local ? false : "require", onnotice: () => {} });
const schema = readFileSync(join(process.cwd(), "sql/schema.sql"), "utf8");

async function main() {
  try {
    await sql.unsafe(schema);
    console.log("Schema applied.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
