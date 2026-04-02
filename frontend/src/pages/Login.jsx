import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted small">Sign in to your ShopZone account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email" className="form-control"
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password" className="form-control"
              id="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-dark w-100 rounded-pill" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Sign In
          </button>
        </form>
        <p className="text-center mt-3 small text-muted">
          Don't have an account? <Link to="/register" className="text-danger fw-semibold">Register</Link>
        </p>
        <p className="text-center small text-muted">
          <strong>Demo Admin:</strong> admin@shop.com / admin123<br />
          <strong>Demo Customer:</strong> customer@shop.com / customer123
        </p>
      </div>
    </div>
  );
};

export default Login;
