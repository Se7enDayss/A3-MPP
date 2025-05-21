import { useEffect, useState } from 'react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [productForm, setProductForm] = useState({ name: '', price: '', categoryId: '' });
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('ASC');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [filterCategory, sortBy, order]);

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    setCategories(await res.json());
  }

  async function fetchProducts() {
    let url = `/api/products?sortBy=${sortBy}&order=${order}`;
    if (filterCategory) url += `&categoryId=${filterCategory}`;
    const res = await fetch(url);
    setProducts(await res.json());
  }

  // Category CRUD
  async function addCategory(e) {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: categoryName }),
      headers: { 'Content-Type': 'application/json' }
    });
    setCategoryName('');
    fetchCategories();
  }

  async function updateCategory(e) {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'PUT',
      body: JSON.stringify({ id: editingCategory.id, name: editingCategory.name }),
      headers: { 'Content-Type': 'application/json' }
    });
    setEditingCategory(null);
    fetchCategories();
  }

  async function deleteCategory(id) {
    await fetch('/api/categories', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchCategories();
    fetchProducts();
  }

  // Product CRUD
  async function addProduct(e) {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: productForm.name,
        price: parseFloat(productForm.price),
        categoryId: parseInt(productForm.categoryId)
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    setProductForm({ name: '', price: '', categoryId: '' });
    fetchProducts();
  }

  async function updateProduct(e) {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'PUT',
      body: JSON.stringify({
        id: editingProduct.id,
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        categoryId: parseInt(editingProduct.categoryId)
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    setEditingProduct(null);
    fetchProducts();
  }

  async function deleteProduct(id) {
    await fetch('/api/products', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchProducts();
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <h1>PC Shop Admin</h1>

      {/* Category Section */}
      <section style={{ marginBottom: 32 }}>
        <h2>Categories</h2>
        <form onSubmit={editingCategory ? updateCategory : addCategory} style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Category name"
            value={editingCategory ? editingCategory.name : categoryName}
            onChange={e =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, name: e.target.value })
                : setCategoryName(e.target.value)
            }
            required
          />
          <button type="submit">{editingCategory ? 'Update' : 'Add'}</button>
          {editingCategory && (
            <button type="button" onClick={() => setEditingCategory(null)}>
              Cancel
            </button>
          )}
        </form>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>
              {cat.name}{' '}
              <button onClick={() => setEditingCategory(cat)}>Edit</button>
              <button onClick={() => deleteCategory(cat.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Product Section */}
      <section>
        <h2>Products</h2>
        <form onSubmit={editingProduct ? updateProduct : addProduct} style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Product name"
            value={editingProduct ? editingProduct.name : productForm.name}
            onChange={e =>
              editingProduct
                ? setEditingProduct({ ...editingProduct, name: e.target.value })
                : setProductForm({ ...productForm, name: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={editingProduct ? editingProduct.price : productForm.price}
            onChange={e =>
              editingProduct
                ? setEditingProduct({ ...editingProduct, price: e.target.value })
                : setProductForm({ ...productForm, price: e.target.value })
            }
            required
            min="0"
            step="0.01"
          />
          <select
            value={editingProduct ? editingProduct.categoryId : productForm.categoryId}
            onChange={e =>
              editingProduct
                ? setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                : setProductForm({ ...productForm, categoryId: e.target.value })
            }
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit">{editingProduct ? 'Update' : 'Add'}</button>
          {editingProduct && (
            <button type="button" onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
          )}
        </form>

        {/* Filter and Sort */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Filter by category:{' '}
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label style={{ marginLeft: 16 }}>
            Sort by:{' '}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </label>
          <label style={{ marginLeft: 16 }}>
            Order:{' '}
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </label>
        </div>

        {/* Product List */}
        <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>${prod.price}</td>
                <td>{prod.Category?.name || ''}</td>
                <td>
                  <button onClick={() => setEditingProduct({
                    id: prod.id,
                    name: prod.name,
                    price: prod.price,
                    categoryId: prod.categoryId
                  })}>Edit</button>
                  <button onClick={() => deleteProduct(prod.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
} 