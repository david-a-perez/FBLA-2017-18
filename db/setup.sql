-- Delete old tables
DROP TABLE IF EXISTS users, books, patrons, book_copies CASCADE;
DROP TYPE IF EXISTS role CASCADE;

-- Create ENUMs
CREATE TYPE role AS ENUM ('teacher','student');
-- CREATE TYPE ___ AS ENUM ('dewey_decimal','author','title','subject'); -- or a opt in checkbox

-- Create tables
CREATE TABLE users (
    cookie text PRIMARY KEY,
    library_name text,
    teacher_checkout_length integer,
    student_checkout_length integer,
    teacher_overdue_fee decimal,
    student_overdue_fee decimal
);

CREATE TABLE books (
    id serial PRIMARY KEY,
    name text NOT NULL,
    author text NOT NULL,
    user_cookie text NOT NULL REFERENCES users ON DELETE CASCADE
);

CREATE TABLE patrons (
    id serial PRIMARY KEY,
    name text NOT NULL,
    role role NOT NULL,
    user_cookie text NOT NULL REFERENCES users ON DELETE CASCADE
);

CREATE TABLE book_copies ( -- will be renamed to something that has isbn or similar meaning
    id serial PRIMARY KEY,
    book integer NOT NULL REFERENCES books ON DELETE CASCADE,
    patron integer NULL REFERENCES patrons ON DELETE SET NULL, -- DEFAULT null, -- change to SET NULL so that table will not delete data on
    checkout_date date,
    call_num text,
    user_cookie text NOT NULL REFERENCES users ON DELETE CASCADE
);
