import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000/api/homepage';

export const TaxonomyManager = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ type: 'category', name: '', slug: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, colRes] = await Promise.all([
        fetch(`${API_BASE}/categories/all`),
        fetch(`${API_BASE}/collections/all`)
      ]);
      const [cats, cols] = await Promise.all([catRes.json(), colRes.json()]);
      setCategories(cats);
      setCollections(cols);
    } catch (error) {
      toast.error('Failed to load metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.slug) return;

    try {
      const res = await fetch(`${API_BASE}/metadata/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (res.ok) {
        toast.success(`${newItem.type} added successfully`);
        setNewItem({ ...newItem, name: '', slug: '' });
        fetchData();
      } else {
        toast.error('Failed to add. Ensure slug is unique.');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/metadata/${type}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success(`${type} deleted`);
        fetchData();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-neutral-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header & Add Form */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-neutral-400" />
          Add New Category or Collection
        </h2>
        
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Type</label>
            <select 
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
            >
              <option value="category">Category</option>
              <option value="collection">Collection</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Display Name</label>
            <input 
              type="text"
              placeholder="e.g. Diamond Charms"
              value={newItem.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewItem({ ...newItem, name, slug: generateSlug(name) });
              }}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">URL Slug (Auto-generated)</label>
            <input 
              type="text"
              value={newItem.slug}
              onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-mono text-neutral-500"
              required
            />
          </div>

          <button 
            type="submit"
            className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories List */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden text-[10px] font-light">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Tag size={14} className="text-neutral-400" /> Managed Categories
            </h3>
            <span className="text-neutral-400 font-medium italic">{categories.length} total</span>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[400px] overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="px-6 py-4 flex items-center justify-between group hover:bg-neutral-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{cat.name}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">slug: {cat.slug}</p>
                </div>
                <button 
                  onClick={() => handleDelete('category', cat.id)}
                  className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Collections List */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden  text-[10px] font-light">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-neutral-400" /> Managed Collections
            </h3>
            <span className="text-neutral-400 font-medium italic">{collections.length} total</span>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[400px] overflow-y-auto">
            {collections.map((col) => (
              <div key={col.id} className="px-6 py-4 flex items-center justify-between group hover:bg-neutral-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{col.name}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">slug: {col.slug}</p>
                </div>
                <button 
                  onClick={() => handleDelete('collection', col.id)}
                  className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Important Note:</strong> Deleting a category or collection here will remove it from the dropdowns and navigation. 
          Existing products assigned to a deleted category will still exist but may not appear in filtered results until reassigned.
        </p>
      </div>
    </div>
  );
};
