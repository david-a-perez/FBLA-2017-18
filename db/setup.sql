-- Delete old tables
--DROP TABLE IF EXISTS users, books, people, patrons, checked_out_books CASCADE;
--DROP TYPE IF EXISTS role CASCADE;

-- Create ENUM's and TABLE's
CREATE OR REPLACE TYPE role AS ENUM ('teacher','student');
-- CREATE TYPE ___ AS ENUM ('dewey_decimal','author','title','subject'); -- or a opt in checkbox

CREATE OR REPLACE TABLE users (
    cookie text PRIMARY KEY,
    library_name text,
    teacher_checkout_length integer,
    student_checkout_length integer
);

CREATE OR REPLACE TABLE books (
    id serial PRIMARY KEY,
    name text,
    quantity integer CHECK (quantity > 0), -- will be removed
    user_cookie text REFERENCES users ON DELETE CASCADE
);

CREATE OR REPLACE TABLE patrons (
    id serial PRIMARY KEY,
    name text,
    role role,
    user_cookie text REFERENCES users ON DELETE CASCADE
);

CREATE OR REPLACE TABLE book_copies ( -- will be renamed to something that has isbn or similar meaning
    id serial PRIMARY KEY,
    book serial REFERENCES books ON DELETE CASCADE,
    patron serial REFERENCES patrons ON DELETE CASCADE, -- change to SET NULL so that table will not delete data on
    checkout_timestamp timestamp,
    user_cookie text REFERENCES users ON DELETE CASCADE
);