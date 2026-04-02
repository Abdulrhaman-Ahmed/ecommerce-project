const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/products - Get all products (with optional category filter & search)
router.get('/', async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    query += ' AND p.category_id = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countQuery = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  try {
    const [products] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, params.slice(0, -2));
    res.json({ products, total: countResult[0].total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC LIMIT 8
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [req.params.id]);
    if (products.length === 0)
      return res.status(404).json({ message: 'Product not found' });
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  if (!name || !price)
    return res.status(400).json({ message: 'Name and price required' });

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock || 0, image_url, category_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, stock=?, image_url=?, category_id=? WHERE id=?',
      [name, description, price, stock, image_url, category_id, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
