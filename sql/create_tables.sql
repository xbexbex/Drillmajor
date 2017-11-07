CREATE TABLE users (
	id SERIAL PRIMARY KEY NOT NULL,
	username varchar(256), 
	email varchar(256), 
	password varchar(256),
	salt varchar(32),
	public_key uuid DEFAULT uuid_generate_v4()
);

CREATE TABLE mems (
	id varchar(6),
	user_id INTEGER REFERENCES users(id),
	name varchar(256),
	best_time NUMERIC(7) DEFAULT -1,
	last_time NUMERIC(7) DEFAULT -1,
	index NUMERIC (4) DEFAULT 0
	
);

CREATE TABLE mems_data (
	id varchar(6) PRIMARY KEY NOT NULL,
	name varchar(256)
);

