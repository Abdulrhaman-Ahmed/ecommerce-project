import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const features = [
  { icon: 'bi-truck', title: 'Free Shipping', text: 'On orders over $50' },
  { icon: 'bi-arrow-counterclockwise', title: 'Easy Returns', text: '30-day return policy' },
  { icon: 'bi-shield-check', title: 'Secure Payment', text: '100% secure checkout' },
  { icon: 'bi-headset', title: '24/7 Support', text: 'Always here to help' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-badge">🔥 NEW ARRIVALS 2025</div>
              <h1 className="hero-title">
                Discover the Best <span style={{ color: '#e94560' }}>Products</span> Online
              </h1>
              <p className="mb-4 fs-5 text-white-50">
                Shop thousands of quality products with fast delivery and easy returns.
              </p>
              <Link to="/products" className="hero-cta me-3">
                Shop Now <i className="bi bi-arrow-right ms-2"></i>
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg rounded-pill">
                Learn More
              </Link>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-end">
              <div className="d-flex gap-3 flex-wrap justify-content-end">
                {[
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
                  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="product"
                    style={{
                      width: 140, height: 140,
                      objectFit: 'cover',
                      borderRadius: 16,
                      border: '3px solid rgba(255,255,255,0.15)',
                      transform: i === 1 ? 'translateY(20px)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white py-4 border-bottom">
        <div className="container">
          <div className="row g-3 text-center">
            {features.map((f, i) => (
              <div key={i} className="col-6 col-md-3">
                <i className={`bi ${f.icon} fs-3 text-danger`}></i>
                <p className="fw-bold mb-0 small mt-1">{f.title}</p>
                <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Featured Products</h2>
            <div className="section-divider"></div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger"></div>
            </div>
          ) : (
            <div className="row g-4">
              {products.map(p => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-dark btn-lg rounded-pill px-5">
              View All Products <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff' }}>
        <div className="container text-center">
          <h2 className="mb-3">🎉 Special Offer!</h2>
          <p className="fs-5 text-white-50 mb-4">Get 20% off your first order with code: <strong className="text-warning">WELCOME20</strong></p>
          <Link to="/products" className="hero-cta">Shop Now</Link>
        </div>
      </section>
    </>
  );
};

export default Home;
