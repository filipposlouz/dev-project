CREATE TABLE Department (
    id SERIAL NOT NULL,
    dept_name VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE Client (
    id SERIAL NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    notes VARCHAR(512),
    department_id SERIAL NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_department
        FOREIGN KEY(department_id)
            REFERENCES Department(id)
);

CREATE TABLE Employee (
    id SERIAL NOT NULL,
    emp_name VARCHAR(100) NOT NULL,
    department_id SERIAL NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_department
        FOREIGN KEY(department_id)
            REFERENCES Department(id)
);

CREATE TABLE CallType (
    calltype VARCHAR(100) NOT NULL,
    PRIMARY KEY(calltype)
);

CREATE TABLE PhoneCall (
    id SERIAL NOT NULL,
    duration TIME NOT NULL,
    incoming BOOLEAN NOT NULL,
    notes VARCHAR(512), 
    files VARCHAR(512),
    calltype VARCHAR(100) NOT NULL,
    client_id SERIAL NOT NULL,
    emp_id SERIAL NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_calltype
        FOREIGN KEY(calltype)
            REFERENCES CallType(calltype),
    CONSTRAINT fk_client
        FOREIGN KEY(client_id)
            REFERENCES Client(id),
    CONSTRAINT fk_employee
        FOREIGN KEY(emp_id)
            REFERENCES Employee(id)
);

CREATE TABLE BasicUser (
    id VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE AdminUser (
    id VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");