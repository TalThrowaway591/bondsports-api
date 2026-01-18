
CREATE DATABASE bondsports;

\c bondsports

-- TODO: add foreign key constraints

DROP TABLE accounts IF EXISTS;

DROP TABLE transactions IF EXISTS;

DROP TABLE persons IF EXISTS;

CREATE TABLE accounts (
    id VARCHAR(16) PRIMARY KEY,
    person_id VARCHAR(16),
    balance INT, -- TODO: money data type?
    daily_withdrawl_limit INT, -- TODO: money data type?
    active_flag BOOLEAN,
    account_type SMALLINT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id VARCHAR(22) PRIMARY KEY,
    account_id VARCHAR(16) REFERENCES accounts(id),
    amount INT, -- TODO: money data type?
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE persons (
    id VARCHAR(16) PRIMARY KEY,
    account_id VARCHAR(16) REFERENCES accounts(id),
    amount INT, -- TODO: money data type?
    created_at TIMESTAMP DEFAULT NOW()
);
