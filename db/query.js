const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:fblapass@localhost/daper"
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
