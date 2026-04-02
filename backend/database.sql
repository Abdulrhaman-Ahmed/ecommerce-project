-- E-Commerce Database Schema
-- Run this file to set up the database

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image_url VARCHAR(500),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_name VARCHAR(150),
  shipping_email VARCHAR(150),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed: Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Phones, laptops, gadgets and more'),
('Clothing', 'Fashion for men and women'),
('Home & Living', 'Furniture, decor and appliances'),
('Sports', 'Sports gear and equipment'),
('Books', 'Educational and entertainment books');

-- Seed: Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@shop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');

-- Seed: Sample Products
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with A17 chip', 1299.99, 50, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 1),
('Samsung Galaxy S24', 'Flagship Android phone with AI features', 999.99, 40, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 1),
('MacBook Pro M3', 'Powerful laptop for professionals', 1999.99, 25, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 1),
('Nike Air Max', 'Classic comfortable sneakers', 129.99, 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 2),
('Levi''s Jeans 501', 'Classic straight fit jeans', 79.99, 80, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 2),
('Wireless Headphones', 'Noise cancelling bluetooth headphones', 249.99, 60, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1),
('Coffee Table Book', 'World Architecture masterpieces', 39.99, 200, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 5),
('Running Shoes', 'Lightweight marathon running shoes', 159.99, 75, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', 4);
