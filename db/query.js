const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = {
    query: function (text, params, callback) {
        return pool.query(text, params, callback)
    }
};
