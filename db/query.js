const pg = require('pg');
const moment = require('moment');
// Interpret date as a simple string
//pg.types.setTypeParser(1082, str => new Date(str).toDateString());
pg.types.setTypeParser(1082, str => moment(str, 'YYYY-MM-DD').format('ddd MMM DD YYYY'));
//pg.types.setTypeParser(1082, str => console.log(str));

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
