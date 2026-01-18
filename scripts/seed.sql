
CREATE DATABASE bondsports;

\c bondsports

CREATE TABLE accounts (
    id VARCHAR(16) PRIMARY KEY,
    person_id VARCHAR(15),
    balance BIGINT, -- TODO: money data type?
    daily_withdrawl_limit BIGINT, -- TODO: money data type?
    active_flag BOOLEAN,
    account_type SMALLINT,
    created_at TIMESTAMP DEFAULT NOW()
);
