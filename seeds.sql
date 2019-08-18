DROP DATABASE if exists bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price decimal(19,4) NULL,
  quantity INT (100),
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, quantity) VALUES 
    ('Sunscreen', 'Health', '5.49', '10'),
    ('Baseball Glove', 'Sports', '20.55', '5'),
    ('Pixies Album', 'Music', '15.65', '7'),
    ('Shirt', 'Clothing', '12.25', '20'),
    ('Dehydrated Ice Crean', 'Other', '5.25', '10');

