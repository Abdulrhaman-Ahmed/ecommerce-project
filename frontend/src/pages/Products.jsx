import React, { useEffect, useState, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: '', category: '', page: 1 });

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getProducts({ ...filters, limit: 12 })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="section-title">All Products</h2>
        <div className="section-divider"></div>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setFilters({ search: '', category: '', page: 1 })}
          >
            <i className="bi bi-x-circle me-2"></i>Clear Filters
          </button>
        </div>
      </div>

      <p className="text-muted mb-4">{total} product{total !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown fs-1 text-muted"></i>
          <p className="text-muted mt-3">No products found. Try a different search.</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
                &laquo;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <li key={p} className={`page-item ${filters.page === p ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setFilters(f => ({ ...f, page: p }))}>{p}</button>
              </li>
            ))}
            <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Products;
