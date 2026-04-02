import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { dispatch } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: 'ADD_ITEM', payload: product });
    }
    toast.success(`${qty}x ${product.name} added to cart!`, { autoClose: 2000 });
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
  if (!product) return (
    <div className="container py-5 text-center">
      <h4>Product not found.</h4>
      <Link to="/products" className="btn btn-dark mt-3">Back to Products</Link>
    </div>
  );

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-5">
          {!imageLoaded && !imageError && (
            <div style={{ height: '420px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
              <div className="spinner-border text-danger"></div>
            </div>
          )}
          <img
            src={imageError ? 'https://via.placeholder.com/500x400?text=No+Image' : product.image_url || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            className="img-fluid rounded-4 shadow"
            style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: imageLoaded || imageError ? 'block' : 'none' }}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="col-md-7">
          <span className="badge bg-secondary mb-2">{product.category_name}</span>
          <h1 className="fs-2 fw-bold mb-2">{product.name}</h1>
          <div className="mb-3">
            {[1,2,3,4,5].map(s => (
              <i key={s} className={`bi bi-star${s <= 4 ? '-fill' : ''} text-warning`}></i>
            ))}
            <span className="text-muted small ms-2">(4.0 / 5)</span>
          </div>
          <h2 className="product-price fs-1 mb-3">${parseFloat(product.price).toFixed(2)}</h2>
          <p className="text-muted mb-4">{product.description}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center border rounded-3 overflow-hidden">
              <button className="qty-btn border-0" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span className="px-3 fw-bold">{qty}</span>
              <button className="qty-btn border-0" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <span className="text-muted small">
              {product.stock > 0 ? (
                <span className="text-success"><i className="bi bi-check-circle me-1"></i>{product.stock} in stock</span>
              ) : (
                <span className="text-danger"><i className="bi bi-x-circle me-1"></i>Out of stock</span>
              )}
            </span>
          </div>

          <button
            className="btn btn-dark btn-lg px-5 rounded-pill me-2"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <i className="bi bi-cart-plus me-2"></i>Add to Cart
          </button>
          <Link to="/cart" className="btn btn-outline-danger btn-lg px-5 rounded-pill">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
