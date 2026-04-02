const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// POST /api/orders - Create new order
router.post('/', authMiddleware, async (req, res) => {
  const { items, shipping, totalPrice } = req.body;
  const userId = req.user.id;

  console.log('Creating order for user:', userId);
  console.log('Order items:', items);
  console.log('Shipping info:', shipping);
  console.log('Total price:', totalPrice);

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!items || items.length === 0)
    return res.status(400).json({ message: 'Order items required' });

  if (
    !shipping ||
    !shipping.name ||
    !shipping.email ||
    !shipping.phone ||
    !shipping.address ||
    !shipping.city
  )
    return res.status(400).json({ message: 'Shipping information required' });

  if (!totalPrice || totalPrice <= 0)
    return res.status(400).json({ message: 'Invalid total price' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // ── 1. Verify every product exists and has enough stock ──────────────────
    for (const item of items) {
      const [rows] = await conn.query(
        'SELECT id, name, stock FROM products WHERE id = ?',
        [item.id]
      );

      if (rows.length === 0) {
        throw Object.assign(new Error(`Product not found (id: ${item.id})`), {
          statusCode: 404,
          clientMessage: `Product with ID ${item.id} no longer exists.`,
        });
      }

      if (rows[0].stock < item.quantity) {
        throw Object.assign(
          new Error(
            `Insufficient stock for "${rows[0].name}": requested ${item.quantity}, available ${rows[0].stock}`
          ),
          {
            statusCode: 400,
            clientMessage: `Sorry, only ${rows[0].stock} unit(s) of "${rows[0].name}" are available.`,
          }
        );
      }
    }

    // ── 2. Insert order ──────────────────────────────────────────────────────
    const [orderResult] = await conn.query(
      `INSERT INTO orders
         (user_id, total_price, status,
          shipping_name, shipping_email, shipping_phone,
          shipping_address, shipping_city)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)`,
      [
        userId,
        totalPrice,
        shipping.name,
        shipping.email,
        shipping.phone,
        shipping.address,
        shipping.city,
      ]
    );

    const orderId = orderResult.insertId;

    // ── 3. Insert order items & deduct stock ─────────────────────────────────
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );

      const [stockResult] = await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.id, item.quantity]
      );

      // Extra safety-net (race condition guard)
      if (stockResult.affectedRows === 0) {
        throw Object.assign(
          new Error(`Stock race condition on product id: ${item.id}`),
          {
            statusCode: 400,
            clientMessage: 'One or more items ran out of stock. Please refresh your cart.',
          }
        );
      }
    }

    // ── 4. Commit ────────────────────────────────────────────────────────────
    await conn.commit();
    res.status(201).json({ orderId, message: 'Order placed successfully!' });

  } catch (err) {
    await conn.rollback();
    console.error('Order creation error:', err.message);
    console.error('Error stack:', err.stack);

    // Known / expected errors (validation, stock, etc.)
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.clientMessage });
    }

    // MySQL FK / null errors
    let errorMessage = 'Server error while placing your order.';
    if (err.code === 'ER_NO_REFERENCED_ROW_2')
      errorMessage = 'Invalid product reference – item may have been removed.';
    else if (err.code === 'ER_BAD_NULL_ERROR')
      errorMessage = 'A required field is missing.';
    else if (err.code === 'ER_DUP_ENTRY')
      errorMessage = 'Duplicate entry detected.';

    res.status(500).json({ message: errorMessage, code: err.code });

  } finally {
    conn.release();
  }
});

// GET /api/orders/my - Get logged-in user's orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('Fetch my orders error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders - Admin: Get all orders
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    res.json(orders);
  } catch (err) {
    console.error('Fetch all orders error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/orders/:id/status - Admin: Update order status
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status))
    return res.status(400).json({ message: 'Invalid status value' });

  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;