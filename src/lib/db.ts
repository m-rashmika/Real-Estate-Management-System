import { Pool } from 'pg';

declare global {
  var _pool: Pool | undefined; // Declare _pool as a Pool instance or undefined
}

let pool: Pool;

if (!global._pool) { // reuse the same pool if it already exists, otherwise create a new one
  global._pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PG_PORT || '5432', 10)
  });
}
pool = global._pool;

export default pool;