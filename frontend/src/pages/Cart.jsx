import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, dispatch, totalPrice } = useCart();

  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const remove = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });

  if (items.length === 0) return (
    <div className="container py-5 text-center">
      <i className="bi bi-cart-x" style={{ fontSize: 80, color: '#ddd' }}></i>
      <h3 className="mt-4 fw-bold">Your cart is empty</h3>
      <p className="text-muted">Add some products to your cart first.</p>
      <Link to="/products" className="btn btn-dark btn-lg rounded-pill px-5 mt-2">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="section-title mb-4">Shopping Cart</h2>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          {items.map(item => (
            <div key={item.id} className="card border-0 shadow-sm mb-3 rounded-4">
              <div className="card-body">
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="cart-item-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted small mb-2">${parseFloat(item.price).toFixed(2)} each</p>
                    <div className="d-flex align-items-center gap-2">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                      <span className="fw-bold px-2">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="product-price fw-bold mb-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => remove(item.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            className="btn btn-outline-secondary btn-sm rounded-pill"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
          >
            <i className="bi bi-trash me-2"></i>Clear All
          </button>
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="cart-summary sticky-top" style={{ top: 80 }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <hr />
            {items.map(item => (
              <div key={item.id} className="d-flex justify-content-between small mb-1">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mb-1">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted small mb-3">
              <span>Shipping</span>
              <span>{totalPrice >= 50 ? <span className="text-success">FREE</span> : '$5.00'}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Total</span>
              <span className="product-price">
                ${(totalPrice + (totalPrice >= 50 ? 0 : 5)).toFixed(2)}
              </span>
            </div>
            <Link to="/checkout" className="btn btn-dark w-100 rounded-pill btn-lg">
              Proceed to Checkout <i className="bi bi-arrow-right ms-2"></i>
            </Link>
            <Link to="/products" className="btn btn-outline-secondary w-100 rounded-pill mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
