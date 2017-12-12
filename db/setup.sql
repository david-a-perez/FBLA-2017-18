-- Delete old tables
DROP TABLE IF EXISTS users, books, people, patrons, book_copies CASCADE;
DROP TYPE IF EXISTS role CASCADE;

-- Create ENUMs
CREATE TYPE role AS ENUM ('teacher','student');
-- CREATE TYPE ___ AS ENUM ('dewey_decimal','author','title','subject'); -- or a opt in checkbox

-- Create tables
CREATE TABLE users (
    cookie text PRIMARY KEY,
    library_name text,
    teacher_checkout_length integer,
    student_checkout_length integer
);

CREATE TABLE books (
    id serial PRIMARY KEY,
    name text,
    author text,
    quantity integer CHECK (quantity > 0), -- will be removed
    user_cookie text REFERENCES users ON DELETE CASCADE
);

CREATE TABLE patrons (
    id serial PRIMARY KEY,
    name text,
    role role,
    user_cookie text REFERENCES users ON DELETE CASCADE
);

CREATE TABLE book_copies ( -- will be renamed to something that has isbn or similar meaning
    id serial PRIMARY KEY,
    book integer NOT NULL REFERENCES books ON DELETE CASCADE,
    patron integer NULL REFERENCES patrons ON DELETE SET NULL, -- DEFAULT null, -- change to SET NULL so that table will not delete data on
    serial_num text,
    checkout_timestamp timestamp,
    user_cookie text REFERENCES users ON DELETE CASCADE
);
