import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Tag,
  Layers,
  AlertCircle,
  RefreshCw,
  Save,
  Edit2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000/api/homepage';

export const TaxonomyManager = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingItems, setSavingItems] = useState({});
  const [editingId, setEditingId] = useState(null); // Tracks ID of item being edited
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

  const updateLocalItem = (type, id, changes) => {
    const setter = type === 'category' ? setCategories : setCollections;
    setter(prev => prev.map(item => (item.id === id ? { ...item, ...changes } : item)));
  };

  const handleAdd = async e => {
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

  const handleSave = async (type, item) => {
    const saveKey = `${type}-${item.id}`;
    setSavingItems(prev => ({ ...prev, [saveKey]: true }));

    try {
      const response = await fetch(`${API_BASE}/metadata/${type}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        toast.success(`${type} updated successfully`);
        fetchData();
      } else {
        toast.error(`Failed to save ${type}`);
      }
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSavingItems(prev => ({ ...prev, [saveKey]: false }));
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

  const generateSlug = name =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const renderTaxonomyItem = (type, item) => {
    const saveKey = `${type}-${item.id}`;
    const isSaving = !!savingItems[saveKey];
    const isEditing = editingId === item.id;
    const setter = type === 'category' ? setCategories : setCollections;

    const handleChange = (field, value) => {
      setter(prev => prev.map(entry => (entry.id === item.id ? { ...entry, [field]: value } : entry)));
    };

    const handleCancel = () => {
      setEditingId(null);
      fetchData(); // Reset changes
    };

    if (isEditing) {
      return (
        <div key={item.id} className="p-4 border-b border-neutral-100 bg-neutral-50/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                Display Name
              </label>
              <input
                type="text"
                value={item.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                URL Slug
              </label>
              <input
                type="text"
                value={item.slug || ''}
                onChange={e => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-mono text-neutral-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-neutral-500 hover:text-neutral-700 text-xs font-medium"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={async () => {
                await handleSave(type, item);
                setEditingId(null);
              }}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className="p-4 border-b border-neutral-100 group hover:bg-neutral-50/50 transition-colors flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">{item.name}</p>
          <p className="text-[10px] text-neutral-400 font-mono italic">slug: {item.slug}</p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditingId(item.id)}
            className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-neutral-200"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => handleDelete(type, item.id)}
            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-neutral-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-neutral-400" />
          Add New Category or Collection
        </h2>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
              Type
            </label>
            <select
              value={newItem.type}
              onChange={e => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
            >
              <option value="category">Category</option>
              <option value="collection">Collection</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
              Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Diamond Charms"
              value={newItem.name}
              onChange={e => {
                const name = e.target.value;
                setNewItem({ ...newItem, name, slug: generateSlug(name) });
              }}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
              URL Slug
            </label>
            <input
              type="text"
              value={newItem.slug}
              onChange={e => setNewItem({ ...newItem, slug: e.target.value })}
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
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Tag size={14} className="text-neutral-400" /> Managed Categories
            </h3>
            <span className="text-neutral-400 font-medium italic">{categories.length} total</span>
          </div>
          <div className="max-h-[700px] overflow-y-auto">
            {categories.map(item => renderTaxonomyItem('category', item))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-neutral-400" /> Managed Collections
            </h3>
            <span className="text-neutral-400 font-medium italic">{collections.length} total</span>
          </div>
          <div className="max-h-[700px] overflow-y-auto">
            {collections.map(item => renderTaxonomyItem('collection', item))}
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-2xl p-4 flex gap-3 border border-neutral-200">
        <Tag className="w-5 h-5 text-neutral-400 shrink-0" />
        <p className="text-xs text-neutral-500 leading-relaxed">
          Manage your website's organization by adding, editing, or removing categories and collections.
          These changes will reflect in the navigation and filter menus across the shop.
        </p>
      </div>
    </div>
  );
};
