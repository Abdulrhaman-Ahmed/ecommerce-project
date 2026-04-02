import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <span>Shop</span>Zone
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setNavOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={() => setNavOpen(false)}>Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" onClick={() => setNavOpen(false)}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={() => setNavOpen(false)}>Contact</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="btn btn-outline-dark btn-sm position-relative">
              <i className="bi bi-cart3"></i>
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="dropdown">
                <button className="btn btn-sm btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>{user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user.role === 'admin' && (
                    <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
                  )}
                  <li><Link className="dropdown-item" to="/my-orders">My Orders</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-dark">
                <i className="bi bi-person me-1"></i>Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
