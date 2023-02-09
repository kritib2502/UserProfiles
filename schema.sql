DROP DATABASE IF EXISTS users_db;
CREATE DATABASE users_db;
USE users_db;

DROP USER IF EXISTS 'profiles_user'@'localhost';
CREATE USER 'profiles_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyPassword1!';
GRANT ALL PRIVILEGES ON some_db_name.* TO 'profiles_user'@'localhost';

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  displayName VARCHAR(255) NOT NULL,
  profileImage VARCHAR(255) NOT NULL
);