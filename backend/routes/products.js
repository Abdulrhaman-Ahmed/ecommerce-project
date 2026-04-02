import express from 'express';
import supabase from '../config/supabase.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

/* ───────────────────────────────
   GET ALL PRODUCTS
─────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 12
    } = req.query;

    let query = supabase
      .from('products')
      .select('*, categories(name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    query = query.range(from, to);

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      products: data,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   FEATURED PRODUCTS
─────────────────────────────── */
router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   GET SINGLE PRODUCT
─────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   CREATE PRODUCT (Admin)
─────────────────────────────── */
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      image_url,
      category_id
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: 'Name and price required',
      });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          stock,
          image_url,
          category_id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   UPDATE PRODUCT (Admin)
─────────────────────────────── */
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      image_url,
      category_id
    } = req.body;

    const { error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
      })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   DELETE PRODUCT (Admin)
─────────────────────────────── */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;