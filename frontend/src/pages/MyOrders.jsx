import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColor = {
  pending: 'warning', processing: 'info', shipped: 'primary',
  delivered: 'success', cancelled: 'danger',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return (
    <div className="container py-5 text-center">
      <h4>Please log in to view your orders.</h4>
      <Link to="/login" className="btn btn-dark mt-3 rounded-pill px-5">Login</Link>
    </div>
  );

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container py-5">
      <h2 className="section-title mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bag-x" style={{ fontSize: 70, color: '#ddd' }}></i>
          <h5 className="mt-3 text-muted">No orders yet.</h5>
          <Link to="/products" className="btn btn-dark rounded-pill px-5 mt-2">Start Shopping</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card border-0 shadow-sm rounded-4 mb-4 p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <div>
                <span className="fw-bold">ID Order: {order.id} </span>
                <span className="text-muted small ms-3">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <span className={`badge bg-${statusColor[order.status] || 'secondary'} text-capitalize`}>
                {order.status}
              </span>
            </div>
            <div className="row g-2">
              {order.items?.map(item => (
                <div key={item.id} className="col-auto">
                  <div className="d-flex align-items-center gap-2 border rounded-3 p-2">
                    <img src={item.image_url} alt={item.name}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                    <div>
                      <p className="mb-0 small fw-semibold">{item.name}</p>
                      <p className="mb-0 small text-muted">x{item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-end">
              <span className="fw-bold product-price fs-5">${parseFloat(order.total_price).toFixed(2)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
