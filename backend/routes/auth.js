import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import supabase from '../config/supabase.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  try {
    // check if user exists
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (checkError) throw checkError;

    if (existing && existing.length > 0)
      return res.status(400).json({ message: 'Email already registered' });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // insert user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashed,
          role: 'customer'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: data.id, name: data.name, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: data
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;