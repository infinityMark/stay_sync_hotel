CREATE DATABASE hotel;
\c hotel;

CREATE TABLE consumer(
    consumerID SERIAL PRIMARY KEY,  -- SERIAL: valid range 1 to 2,147,483,647

    first_name VARCHAR(100) NOT NULL,
    family_name VARCHAR(100) NOT NULL,
    ID_number VARCHAR(50) NOT NULL UNIQUE,

    gender VARCHAR(1) NOT NULL, -- constrains between M and F
    birthday DATE NOT NULL,

    -- gender constraints
    CONSTRAINT consumer_gender_format CHECK(gender IN ('M', 'F')),
    CONSTRAINT consumer_birthday_check CHECK(birthday < CURRENT_DATE)
);

CREATE TABLE roomCategory(
    categoryID SERIAL PRIMARY KEY,
    
    title VARCHAR(100) NOT NULL,
    price NUMERIC(7,2) NOT NULL,
    bed_number SMALLINT NOT NULL
);

CREATE TABLE room(
    roomID SERIAL PRIMARY KEY,

    categoryID INTEGER NOT NULL REFERENCES roomCategory(categoryID),
    
    room_number VARCHAR(16) NOT NULL UNIQUE,
    floor SMALLINT NOT NULL,
    statuses VARCHAR(10) NOT NULL,
    CONSTRAINT statuses_validation CHECK(statuses IN ('idle', 'reserved', 'maintain'))
);

CREATE TABLE transaction(
    transactionID SERIAL PRIMARY KEY,

    amount NUMERIC(8,2) NOT NULL,
    transaction_date date DEFAULT CURRENT_DATE,
    pay_category VARCHAR(20) NOT NULL,

    CONSTRAINT pay_category CHECK (
        pay_category IN ('cash', 'credit card', 'bank transfer', 'mobile wallet')
    )
);

CREATE TABLE account (
    -- # corresponding account
    accountID SERIAL PRIMARY KEY,  -- SERIAL: valid range 1 to 2,147,483,647
    consumerID INTEGER NOT NULL REFERENCES consumer (consumerID) ON DELETE CASCADE, 

    -- # identity information
    userName VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- will be hashed, the length because normally the Node.js hashed length is 60 characters

    email VARCHAR(255) NOT NULL UNIQUE, -- constraint
    phonePrefix VARCHAR(16) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    register_day DATE NOT NULL DEFAULT CURRENT_DATE,

    -- email constraints
    CONSTRAINT account_email_format CHECK(
        email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        -- ~* imply not to restrick capital or lower case
    ),

    -- phone constraints
    CONSTRAINT account_phone_format CHECK(
        phone ~ '^[0-9]{7,20}$'
    ),
    -- phone prefix constraints
    CONSTRAINT account_valid_phone_prefix CHECK (
        phonePrefix ~ '^\+\d{1,8}$'
    ),

    CONSTRAINT unique_account_phone UNIQUE (phonePrefix, phone)
);

CREATE TABLE reservation(
    reservationID SERIAL PRIMARY KEY,
    consumerID INTEGER NOT NULL REFERENCES consumer(consumerID) ON DELETE CASCADE,
    roomID INTEGER NOT NULL REFERENCES room(roomID),

    transactionID INTEGER REFERENCES transaction(transactionID),

    arrive_date DATE NOT NULL,
    depart_date DATE NOT NULL,

    CONSTRAINT date_validation CHECK (
        arrive_date < depart_date
    ) 
);

CREATE TABLE service (
    serviceID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(8,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservation_service (
    id SERIAL PRIMARY KEY,
    
    consumerID INTEGER NOT NULL REFERENCES consumer(consumerID) ON DELETE CASCADE,
    
    reservationID INTEGER REFERENCES reservation(reservationID) ON DELETE CASCADE,
    
    serviceID INTEGER NOT NULL REFERENCES service(serviceID),
    
    transactionID INTEGER UNIQUE REFERENCES transaction(transactionID),
    
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_time NUMERIC(8,2) NOT NULL,
    consumed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_reservation_consumer ON reservation(consumerID);
CREATE INDEX idx_reservation_room ON reservation(roomID);
CREATE INDEX idx_reservation_room_dates ON reservation(roomID, arrive_date, depart_date);

CREATE INDEX idx_res_service_consumer ON reservation_service(consumerID);
CREATE INDEX idx_res_service_reservation ON reservation_service(reservationID);  -- 允许 NULL，依然可索引
CREATE INDEX idx_res_service_service ON reservation_service(serviceID);
CREATE INDEX idx_res_service_transaction ON reservation_service(transactionID);