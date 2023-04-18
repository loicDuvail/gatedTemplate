CREATE TABLE Admins(
    id INT IDENTITY(1,1),
    email VARCHAR(150) UNIQUE,
    username VARCHAR(30) UNIQUE,
    hash CHAR(64),
    salt VARCHAR(50),
    CONSTRAINT PK_Admins PRIMARY KEY (id)
);