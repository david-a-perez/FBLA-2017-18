const db = require('./query');
// Change to read file and then query
db.query("DROP TABLE IF EXISTS users, books, people, checked_out_books CASCADE;\n" +
    "DROP TYPE IF EXISTS role CASCADE;\n" +
    "\n" +
    "CREATE TYPE role AS ENUM ('teacher','student');\n" +
    "-- CREATE TYPE ___ AS ENUM ('dewey_decimal','author','title','subject'); -- or a opt in checkbox\n" +
    "\n" +
    "CREATE TABLE users (\n" +
    "    cookie text PRIMARY KEY,\n" +
    "    library_name text,\n" +
    "    teacher_checkout_length integer,\n" +
    "    student_checkout_length integer\n" +
    ");\n" +
    "\n" +
    "CREATE TABLE books (\n" +
    "    id serial PRIMARY KEY,\n" +
    "    name text,\n" +
    "    quantity integer CHECK (quantity > 0), -- will be removed\n" +
    "    user_cookie text REFERENCES users ON DELETE CASCADE\n" +
    ");\n" +
    "\n" +
    "CREATE TABLE people (\n" +
    "    id serial PRIMARY KEY,\n" +
    "    name text,\n" +
    "    role role,\n" +
    "    user_cookie text REFERENCES users ON DELETE CASCADE\n" +
    ");\n" +
    "\n" +
    "CREATE TABLE checked_out_books ( -- will be renamed to something that has isbn or similar meaning\n" +
    "    id serial PRIMARY KEY,\n" +
    "    book serial REFERENCES books ON DELETE CASCADE,\n" +
    "    person serial REFERENCES people ON DELETE CASCADE, -- change to SET NULL so that table will not delete data on\n" +
    "    checkout_timestamp timestamp,\n" +
    "    user_cookie text REFERENCES users ON DELETE CASCADE\n" +
    ");");