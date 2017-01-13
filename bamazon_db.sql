CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL, 
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(7) NOT NULL,
PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Computer', 'Electronics', 799.99, 150),
	   ('Mouse', 'Electronics', 12.99, 50),
	   ('Keyboard', 'Electronics', 45.00, 25),
	   ('Router', 'Electronics', 119.99, 10),
	   ('Printer', 'Electronics', 199.99, 23),
	   ('12 Pens Pack', 'Stationary', 12.95, 12), 
	   ('Printer Paper', 'Stationary', 9.99, 8), 
	   ('Toner', 'Electronics', 49.98, 3),
	   ('Air Freshener', 'Household', 2.99, 1000),
	   ('Fan', 'Household', 29.99, 5),
	   ('12 Pencils Pack', 'Stationary', 7.99, 17);