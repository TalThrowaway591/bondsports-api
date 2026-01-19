\c bondsports

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS persons;

CREATE TABLE persons (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(128) ,
    document VARCHAR(128), 
    birthDate DATE
);

CREATE TABLE accounts (
    id VARCHAR(16) PRIMARY KEY,
    person_id VARCHAR(16) REFERENCES persons(id),
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

INSERT INTO persons VALUES ('person-9vn23g8z', 'John Doe', '/document/person-9vn23g8z', '1998-03-04');
INSERT INTO persons VALUES ('person-k6ls84y3', 'Super Man', '/document/person-k6ls84y3', '1996-01-05');

INSERT INTO accounts VALUES ('account-ai4fj8aj', 'person-9vn23g8z', 0, 2000, TRUE, 0, NOW());
INSERT INTO accounts VALUES ('account-nv49u32z', 'person-k6ls84y3', 70, 2000, TRUE, 0, NOW());

INSERT INTO transactions VALUES ('transaction-hj3qv35wi', 'account-nv49u32z', 10, '2026-01-01 12:00:00');
INSERT INTO transactions VALUES ('transaction-3hv8jzkh', 'account-nv49u32z', 20, '2026-01-03 12:00:00');
INSERT INTO transactions VALUES ('transaction-mde93yms', 'account-nv49u32z', 60, '2026-01-05 12:00:00');
INSERT INTO transactions VALUES ('transaction-67fbeiof', 'account-nv49u32z', -20, '2026-01-07 12:00:00');