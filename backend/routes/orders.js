import express from 'express';
import supabase from '../config/supabase.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

/* ───────────────────────────────────────────────
   POST /api/orders - Create new order
─────────────────────────────────────────────── */
router.post('/', authMiddleware, async (req, res) => {
  const { items, shipping, totalPrice } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'Order items required' });

  if (
    !shipping?.name ||
    !shipping?.email ||
    !shipping?.phone ||
    !shipping?.address ||
    !shipping?.city
  )
    return res.status(400).json({ message: 'Shipping information required' });

  if (!totalPrice || totalPrice <= 0)
    return res.status(400).json({ message: 'Invalid total price' });

  try {
    // 1️⃣ Check products & stock
    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('id, name, stock')
        .eq('id', item.id)
        .single();

      if (error || !product) {
        return res.status(404).json({
          message: `Product not found (id: ${item.id})`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sorry, only ${product.stock} units of "${product.name}" are available.`,
        });
      }
    }

    // 2️⃣ Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total_price: totalPrice,
          status: 'pending',
          shipping_name: shipping.name,
          shipping_email: shipping.email,
          shipping_phone: shipping.phone,
          shipping_address: shipping.address,
          shipping_city: shipping.city,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderId = order.id;

    // 3️⃣ Insert items + update stock
    for (const item of items) {
      const { error: itemError } = await supabase.from('order_items').insert([
        {
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        },
      ]);

      if (itemError) throw itemError;

      // update stock
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: supabase.rpc('decrement_stock', {
          product_id: item.id,
          qty: item.quantity
        }) });

      if (stockError) throw stockError;
    }

    res.status(201).json({ orderId, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────────────────────
   GET /api/orders/my
─────────────────────────────────────────────── */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────────────────────
   GET /api/orders - Admin only
─────────────────────────────────────────────── */
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────────────────────
   PUT /api/orders/:id/status
─────────────────────────────────────────────── */
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(status))
    return res.status(400).json({ message: 'Invalid status value' });

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;