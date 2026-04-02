import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct, getCategories } from '../services/api';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', image_url: '', category_id: '',
  });

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
    if (isEdit) {
      getProduct(id).then(res => {
        const p = res.data;
        setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, image_url: p.image_url || '', category_id: p.category_id || '' });
      }).catch(() => toast.error('Product not found'));
    }
  }, [id, isEdit]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(id, form);
        toast.success('Product updated!');
      } else {
        await createProduct(form);
        toast.success('Product created!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <h2 className="section-title mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input className="form-control" id="name" placeholder="Product Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
            <label htmlFor="name">Product Name *</label>
          </div>
          <div className="form-floating mb-3">
            <textarea className="form-control" id="description" placeholder="Description" style={{ minHeight: '100px' }} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
            <label htmlFor="description">Description</label>
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input type="number" step="0.01" className="form-control" id="price" placeholder="Price" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} required />
                <label htmlFor="price">Price *</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input type="number" className="form-control" id="stock" placeholder="Stock" value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })} />
                <label htmlFor="stock">Stock</label>
              </div>
            </div>
          </div>
          <div className="form-floating mb-3">
            <input className="form-control" id="image_url" placeholder="Image URL" value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })} />
            <label htmlFor="image_url">Image URL</label>
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="mt-2 rounded-3"
                style={{ height: 120, objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none'; }} />
            )}
          </div>
          <div className="form-floating mb-4">
            <select className="form-select" id="category_id" value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label htmlFor="category_id">Category</label>
          </div>
          <div className="d-flex gap-3">
            <button type="submit" className="btn btn-dark rounded-pill px-5" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => navigate('/admin')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
