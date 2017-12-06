const db = require('./query');
const fs = require('fs');
// Read and execute the setup.sql file
const contents = fs.readFileSync('setup.sql', 'utf8');
db.query(contents);