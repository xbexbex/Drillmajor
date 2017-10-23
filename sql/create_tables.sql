CREATE TABLE users (
	id SERIAL PRIMARY KEY NOT NULL,
	username varchar(256), 
	email varchar(256), 
	password varchar(256),
	salt varchar(32),
	publicKey uuid DEFAULT uuid_generate_v4()
);

CREATE TABLE mems (
	id varchar(6),
	user_id INTEGER REFERENCES users(id),
	name varchar(256),
	bestTime NUMERIC(6, 2),
	lastTime NUMERIC(6, 2)
);

CREATE TABLE memsData (
	id varchar(6) PRIMARY KEY NOT NULL,
	name varchar(256)
);

