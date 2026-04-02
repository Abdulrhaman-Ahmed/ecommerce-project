import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart!`, { autoClose: 2000 });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="card product-card">
      <Link to={`/products/${product.id}`}>
        {!imageLoaded && !imageError && (
          <div style={{ height: '220px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-danger"></div>
          </div>
        )}
        <img
          src={imageError ? 'https://via.placeholder.com/400x220?text=No+Image' : product.image_url || 'https://via.placeholder.com/400x220?text=No+Image'}
          className="card-img-top"
          alt={product.name}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded || imageError ? 'block' : 'none' }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2" style={{ width: 'fit-content', fontSize: '11px' }}>
          {product.category_name || 'General'}
        </span>
        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
          <h6 className="card-title fw-semibold mb-1">{product.name}</h6>
        </Link>
        <p className="card-text text-muted small mb-2" style={{ flexGrow: 1 }}>
          {product.description?.slice(0, 60)}...
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
          <button className="btn-add-cart" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of Stock' : <><i className="bi bi-cart-plus me-1"></i>Add</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
