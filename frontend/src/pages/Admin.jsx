import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, getAllOrders, updateOrderStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const statusColor = { pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger' };

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/'); return; }
    Promise.all([
      getProducts({ limit: 100 }),
      getAllOrders(),
    ]).then(([pRes, oRes]) => {
      setProducts(pRes.data.products);
      setOrders(oRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, isAdmin, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Admin Dashboard</h2>
        <Link to="/admin/product/new" className="btn btn-dark rounded-pill px-4">
          <i className="bi bi-plus-lg me-2"></i>Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Products', value: products.length, icon: 'bi-box-seam', color: '#e94560' },
          { label: 'Orders', value: orders.length, icon: 'bi-bag-check', color: '#1a1a2e' },
          { label: 'Revenue', value: `$${orders.reduce((a, o) => a + parseFloat(o.total_price), 0).toFixed(0)}`, icon: 'bi-currency-dollar', color: '#28a745' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: 'bi-clock', color: '#ffc107' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
              <i className={`bi ${s.icon} fs-2 mb-2`} style={{ color: s.color }}></i>
              <h4 className="fw-bold mb-0">{s.value}</h4>
              <p className="text-muted small mb-0">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            Products
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            Orders
          </button>
        </li>
      </ul>

      {tab === 'products' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th><th>Name</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image_url} alt={p.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/50'; }} />
                  </td>
                  <td className="fw-semibold">{p.name}</td>
                  <td><span className="badge bg-secondary">{p.category_name}</span></td>
                  <td className="text-danger fw-bold">${parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${p.stock > 0 ? 'success' : 'danger'}`}>{p.stock}</span>
                  </td>
                  <td>
                    <Link to={`/admin/product/${p.id}`} className="btn btn-sm btn-outline-dark me-2 rounded-pill">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(p.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="fw-bold">{o.id}</td>
                  <td>{o.shipping_name}<br /><span className="text-muted small">{o.shipping_email}</span></td>
                  <td className="text-danger fw-bold">${parseFloat(o.total_price).toFixed(2)}</td>
                  <td className="small">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td><span className={`badge bg-${statusColor[o.status]}`}>{o.status}</span></td>
                  <td>
                    <select className="form-select form-select-sm" style={{ width: 130 }}
                      value={o.status}
                      onChange={e => handleStatus(o.id, e.target.value)}>
                      {['pending','processing','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
