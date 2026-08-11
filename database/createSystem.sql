CREATE DATABASE hotel_management;

CREATE TABLE consumer(
    consumerID SERIAL PRIMARY KEY NOT NULL UNIQUE,  -- SERIAL: valid range 1 to 2,147,483,647

    first_name VARCHAR(100) NOT NULL,
    family_name VARCHAR(100) NOT NULL,
    ID_number VARCHAR(50) NOT NULL,

    gender VARCHAR(1) NOT NULL -- constrains between M and F

    -- gender constraints
    CONSTRAINT gender_format CHECK(
        gender IN ('M', 'F')
    )
);

CREATE TABLE account (
    -- # corresponding account
    accountID SERIAL PRIMARY KEY NOT NULL UNIQUE,  -- SERIAL: valid range 1 to 2,147,483,647
    consumerID SERIAL NOT NULL REFERENCES consumer (consumerID), 

    -- # identity information
    userName VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    family_name VARCHAR(100) NOT NULL,
    ID_number VARCHAR(50) NOT NULL,

    nationality VARCHAR(8) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, -- constraint
    phonePrefix VARCHAR(16) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    passwords VARCHAR(64) NOT NULL, -- will be hashed, the length because normally the Node.js hashed length is 60 characters
    birthday DATE NOT NULL,
    gender VARCHAR(1) NOT NULL, -- constrains between M and F
    
    register_day DATE NOT NULL default CURRENT_DATE

    -- gender constraints
    CONSTRAINT gender_format CHECK(
        gender IN ('M', 'F')
    )

    -- email constraints
    CONSTRAINT email_format CHECK(
        email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$'
        -- ~* imply not to restrick capital or lower case
    )

    -- phone constraints
    CONSTRAINT phone_format CHECK(
        phone ~ '^[0-9]{7,20}$'
    )
    -- phone prefix constraints
    CONSTRAINT valid_phone_prefix CHECK (
        phonePrefix ~ '^\+\d{1,8}$'
    ),
    CONSTRAINT unique_customer_phone UNIQUE (phonePrefix, phone)
);

CREATE TABLE roomCategory(
    categoryID SERIAL NOT NULL PRIMARY KEY UNIQUE,
    
    title VARCHAR(100) NOT NULL,
    price NUMERIC(7,2) NOT NULL,
    bed_number decimal(2) NOT NULL
)

CREATE TABLE room(
    roomID SERIAL NOT NULL PRIMARY KEY UNIQUE,

    categoryID SERIAL NOT NULL FOREIGN KEY,
    
    room_number VARCHAR(5) NOT NULL UNIQUE,
    floor decimal(2) NOT NULL,
    statuses VARCHAR(10) NOT NULL

    CONSTRAINT statuses_validation(
        statuses IN ('idle', 'reserved', 'maintain')
    )
)