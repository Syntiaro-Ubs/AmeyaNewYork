import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Upload, 
  Check, 
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from './constants';
const HP_API_BASE = 'http://localhost:5000/api/homepage';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    price: '',
    category: '',
    collection: '',
    description: '',
    material: '',
    gemstone: '',
    featured: false,
    in_stock: true,
    stock_quantity: 0,
    image: null,
    gallery: []
  });
  const [activeFilterTab, setActiveFilterTab] = useState('categories'); // 'categories' or 'collections'
  const [activeFilter, setActiveFilter] = useState('all');
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        fetch(`${HP_API_BASE}/categories/all`),
        fetch(`${HP_API_BASE}/collections/all`)
      ]);
      const [cats, cols] = await Promise.all([catRes.json(), colRes.json()]);
      setDynamicCategories(cats);
      setDynamicCollections(cols);
    } catch (error) {
      console.error('Failed to fetch metadata');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'gallery') {
      setFormData({ ...formData, gallery: Array.from(files) });
    } else {
      setFormData({ ...formData, image: files[0] });
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        image: null,
        gallery: [] // Reset for upload
      });
    } else {
      setEditingProduct(null);
      setFormData({
        product_id: '',
        name: '',
        price: '',
        category: activeFilterTab === 'categories' && activeFilter !== 'all' ? activeFilter : '',
        collection: activeFilterTab === 'collections' && activeFilter !== 'all' ? activeFilter : '',
        description: '',
        material: '',
        gemstone: '',
        featured: false,
        in_stock: true,
        stock_quantity: 0,
        image: null,
        gallery: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.price || !formData.category || !formData.product_id) {
      toast.error("Please fill in all required fields (Name, Price, Category, Product ID)");
      return;
    }

    const submitData = new FormData();
    
    // Process all fields except files
    Object.keys(formData).forEach(key => {
      if (key !== 'image' && key !== 'gallery') {
        submitData.append(key, formData[key]);
      }
    });

    // Main image
    if (formData.image) {
      submitData.append('image', formData.image);
    } else if (editingProduct && editingProduct.image) {
      submitData.append('image', editingProduct.image);
    }

    // Gallery images
    if (formData.gallery && formData.gallery.length > 0) {
      formData.gallery.forEach(file => {
        submitData.append('gallery', file);
      });
    } else if (editingProduct && editingProduct.gallery) {
      submitData.append('gallery', JSON.stringify(editingProduct.gallery));
    }

    try {
      const url = editingProduct ? `${API_BASE_URL}/${editingProduct.id}` : API_BASE_URL;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData
      });

      const resData = await response.json();

      if (response.ok) {
        toast.success(`Product ${editingProduct ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        fetchProducts();
      } else {
        // Show the specific error from backend (e.g., "Duplicate entry '...' for key 'product_id'")
        toast.error(resData.error || resData.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error('An error occurred. Check backend logs.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          toast.success('Product deleted');
          fetchProducts();
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name?.toLowerCase() || '';
    const pid = p.product_id?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || pid.includes(search);
    
    if (activeFilter === 'all') return matchesSearch;
    
    const matchesFilter = activeFilterTab === 'categories' 
      ? p.category === activeFilter 
      : p.collection === activeFilter;
      
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Products</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">In Stock</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{products.filter(p => p.in_stock).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Featured Items</p>
          <p className="text-2xl font-semibold text-amber-500 mt-1">{products.filter(p => p.featured).length}</p>
        </div>
      </div>

      {/* Sub-Tabs for Products */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setActiveFilterTab('categories'); setActiveFilter('all'); }}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeFilterTab === 'categories' ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-900'}`}
          >
            Categories
          </button>
          <button
            onClick={() => { setActiveFilterTab('collections'); setActiveFilter('all'); }}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeFilterTab === 'collections' ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-900'}`}
          >
            Collections
          </button>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === 'all' ? 'bg-neutral-200 text-neutral-900' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
        >
          All {activeFilterTab}
        </button>
        {(activeFilterTab === 'categories' ? dynamicCategories : dynamicCollections).map(item => (
          <button
            key={item.slug}
            onClick={() => setActiveFilter(item.slug)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === item.slug ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-900'}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </span>
            <input
              type="text"
              placeholder={`Search ${activeFilter === 'all' ? '' : activeFilter} products...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-neutral-400">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-neutral-400">No products found.</td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                        {product.image ? (
                          <img 
                            src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                        <div className="text-xs text-neutral-500 capitalize">
                          {dynamicCollections.find(c => c.slug === product.collection)?.name || product.collection?.replace('-', ' ') || 'No Collection'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{product.product_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 capitalize">
                      {dynamicCategories.find(c => c.slug === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{product.stock_quantity || 0} units</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {product.in_stock ? (
                        <span className="flex items-center text-emerald-600 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          In Stock
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(product)} className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-medium text-neutral-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Product ID</label>
                    <input
                      type="text"
                      name="product_id"
                      value={formData.product_id}
                      onChange={handleInputChange}
                      placeholder="e.g. RING-001"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm capitalize"
                      required
                    >
                      <option value="">Select Category</option>
                      {dynamicCategories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Collection</label>
                    <select
                      name="collection"
                      value={formData.collection}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm capitalize"
                      required
                    >
                      <option value="">Select Collection</option>
                      {dynamicCollections.map(col => <option key={col.slug} value={col.slug}>{col.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      Material
                      <span className="text-[10px] lowercase text-neutral-400 font-normal italic">use comma for variants (e.g. 18k White Gold, 18k Yellow Gold)</span>
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="e.g. 18k White Gold"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Gemstone</label>
                    <input
                      type="text"
                      name="gemstone"
                      value={formData.gemstone}
                      onChange={handleInputChange}
                      placeholder="e.g. Diamond"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                    />
                  </div>
                </div>


                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Main Product Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 border-dashed rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-10 w-10 text-neutral-300" />
                        <div className="flex text-sm text-neutral-600">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-neutral-900 hover:text-neutral-700">
                            <span>Upload a file</span>
                            <input name="image" type="file" className="sr-only" onChange={handleFileChange} />
                          </label>
                        </div>
                        {formData.image && <p className="text-xs text-emerald-600 mt-2">✓ {formData.image.name}</p>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Gallery Images (Multi-select)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 border-dashed rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                      <div className="space-y-1 text-center">
                        <Plus className="mx-auto h-10 w-10 text-neutral-300" />
                        <div className="flex text-sm text-neutral-600">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-neutral-900 hover:text-neutral-700">
                            <span>Add gallery files</span>
                            <input name="gallery" type="file" className="sr-only" multiple onChange={handleFileChange} />
                          </label>
                        </div>
                        {formData.gallery.length > 0 && <p className="text-xs text-amber-600 mt-2">{formData.gallery.length} files selected</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-8">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="sr-only" 
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.featured ? 'bg-amber-400' : 'bg-neutral-200'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.featured ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-neutral-700">Featured Product</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        name="in_stock"
                        checked={formData.in_stock}
                        onChange={handleInputChange}
                        className="sr-only" 
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.in_stock ? 'bg-emerald-400' : 'bg-neutral-200'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.in_stock ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-neutral-700">Available in Stock</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-4 py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
