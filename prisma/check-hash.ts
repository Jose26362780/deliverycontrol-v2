import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const r = await p.query(
    "SELECT u.email, LEFT(a.password, 12) AS prefix, LENGTH(a.password) AS len FROM accounts a JOIN users u ON u.id = a.user_id WHERE a.provider_id = 'credential'"
  );
  console.log(r.rows.map(x => x.email + ' | ' + x.prefix + ' | len=' + x.len).join('\n') || '(sem credential accounts)');
  await p.end();
}

main();
