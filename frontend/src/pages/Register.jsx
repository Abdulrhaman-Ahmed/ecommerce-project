import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      loginUser(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-muted small">Join ShopZone today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input className="form-control" id="name" placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
            <label htmlFor="name">Full Name</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-floating mb-4">
            <input type="password" className="form-control" id="confirm" placeholder="Confirm Password" value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            <label htmlFor="confirm">Confirm Password</label>
          </div>
          <button type="submit" className="btn btn-dark w-100 rounded-pill" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            Create Account
          </button>
        </form>
        <p className="text-center mt-3 small text-muted">
          Already have an account? <Link to="/login" className="text-danger fw-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
