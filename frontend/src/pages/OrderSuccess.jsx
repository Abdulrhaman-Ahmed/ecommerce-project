import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const { state } = useLocation();
  return (
    <div className="container py-5 text-center">
      <div style={{
        width: 100, height: 100,
        background: 'linear-gradient(135deg,#1a1a2e,#e94560)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <i className="bi bi-check-lg text-white" style={{ fontSize: 48 }}></i>
      </div>
      <h2 className="fw-bold mb-2">Order Placed Successfully! 🎉</h2>
      {state?.orderId && (
        <p className="text-muted mb-1">Order ID: <strong>#{state.orderId}</strong></p>
      )}
      <p className="text-muted mb-4">Thank you for your purchase. We'll process your order shortly.</p>
      <Link to="/" className="btn btn-dark rounded-pill px-5 me-3">Back to Home</Link>
      <Link to="/my-orders" className="btn btn-outline-dark rounded-pill px-5">View My Orders</Link>
    </div>
  );
};

export default OrderSuccess;
