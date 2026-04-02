import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { items, totalPrice, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
  });

  const shipping = totalPrice >= 50 ? 0 : 5;
  const grandTotal = totalPrice + shipping;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) return toast.error('Your cart is empty!');

    if (!user) {
      toast.error('Please log in to place your order.');
      navigate('/login');
      return;
    }

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city
    )
      return toast.error('Please fill in all required fields.');

    // ── Guard: make sure every cart item has the required fields ────────────
    const invalidItem = items.find(
      (i) => !i.id || i.price == null || i.quantity == null
    );
    if (invalidItem) {
      toast.error('One or more cart items are invalid. Please refresh.');
      return;
    }

    setLoading(true);
    try {
      const res = await placeOrder({
        items: items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        shipping: form,
        totalPrice: grandTotal,
      });

      dispatch({ type: 'CLEAR_CART' });
      toast.success('🎉 Order placed successfully!');
      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      // Show the exact message returned by the backend
      const msg =
        err.response?.data?.message ||
        'Failed to place order. Please try again.';
      toast.error(msg);
      console.error('Place order error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0)
    return (
      <div className="container py-5 text-center">
        <h4>Your cart is empty.</h4>
        <Link to="/products" className="btn btn-dark mt-3 rounded-pill px-5">
          Shop Now
        </Link>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="section-title mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Shipping Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-geo-alt me-2 text-danger"></i>Shipping
                Information
              </h5>
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      name="name"
                      className="form-control"
                      id="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="name">Full Name *</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="email">Email *</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      name="phone"
                      className="form-control"
                      id="phone"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="phone">Phone *</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      name="address"
                      className="form-control"
                      id="address"
                      placeholder="Address"
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="address">Address *</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      name="city"
                      className="form-control"
                      id="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="city">City *</label>
                  </div>
                </div>
              </div>

              <h5 className="fw-bold mt-4 mb-3">
                <i className="bi bi-credit-card me-2 text-danger"></i>Payment
                Method
              </h5>
              <div className="border rounded-3 p-3 bg-light">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="cod"
                    defaultChecked
                  />
                  <label className="form-check-label fw-semibold" htmlFor="cod">
                    <i className="bi bi-cash-coin me-2"></i>Cash on Delivery
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="card"
                    disabled
                  />
                  <label className="form-check-label text-muted" htmlFor="card">
                    <i className="bi bi-credit-card me-2"></i>Credit Card
                    (coming soon)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="cart-summary rounded-4">
              <h5 className="fw-bold mb-3">Your Order</h5>
              <hr />
              {items.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between small mb-2"
                >
                  <span>
                    {item.name}{' '}
                    <span className="text-muted">x{item.quantity}</span>
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-1 small">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-muted">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span className="product-price">${grandTotal.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className="btn btn-dark w-100 rounded-pill btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <i className="bi bi-bag-check me-2"></i>
                )}
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;