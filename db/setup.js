const db = require('./query');
const fs = require('fs');

const contents = fs.readFileSync('setup.sql', 'utf8');
db.query(contents);