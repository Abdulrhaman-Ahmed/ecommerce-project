import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="py-5 mt-5">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <h5 className="fw-bold mb-3"><span style={{color:'#e94560'}}>Shop</span>Zone</h5>
          <p className="small">Your one-stop online store for everything you need. Quality products, fast delivery.</p>
          <div className="d-flex gap-3 mt-3">
            <a href="#!"><i className="bi bi-facebook fs-5"></i></a>
            <a href="#!"><i className="bi bi-instagram fs-5"></i></a>
            <a href="#!"><i className="bi bi-twitter-x fs-5"></i></a>
          </div>
        </div>
        <div className="col-md-2">
          <h5 className="fw-bold mb-3">Shop</h5>
          <ul className="list-unstyled small">
            <li className="mb-2"><Link to="/products">All Products</Link></li>
            <li className="mb-2"><Link to="/cart">Cart</Link></li>
            <li className="mb-2"><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>
        <div className="col-md-2">
          <h5 className="fw-bold mb-3">Info</h5>
          <ul className="list-unstyled small">
            <li className="mb-2"><Link to="/about">About Us</Link></li>
            <li className="mb-2"><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h5 className="fw-bold mb-3">Contact</h5>
          <p className="small mb-1"><i className="bi bi-geo-alt me-2"></i>123 Main Street, Cairo, Egypt</p>
          <p className="small mb-1"><i className="bi bi-envelope me-2"></i>support@shopzone.com</p>
          <p className="small"><i className="bi bi-telephone me-2"></i>+20 100 000 0000</p>
        </div>
      </div>
      <hr className="border-secondary mt-4" />
      <p className="text-center small mb-0">© 2025 ShopZone. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
