import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Tag,
  Layers,
  AlertCircle,
  RefreshCw,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000/api/homepage';
const UPLOAD_API = 'http://localhost:5000/api/homepage/upload';

export const TaxonomyManager = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingItems, setSavingItems] = useState({});
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

  const handleUpload = async (type, id, field, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(UPLOAD_API, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        updateLocalItem(type, id, { [field]: data.media_url });
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
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

  const renderImageCard = (type, item, field, label) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
        {label}
      </label>
      <div className="relative aspect-video bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 group">
        {item[field] ? (
          <img
            src={`http://localhost:5000${item[field]}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <ImageIcon size={18} />
          </div>
        )}
        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-medium border border-white/20">
            <Upload size={12} />
            {item[field] ? 'Replace Image' : 'Upload Image'}
          </div>
          <input
            type="file"
            className="sr-only"
            onChange={e => handleUpload(type, item.id, field, e.target.files?.[0])}
          />
        </label>
      </div>
    </div>
  );

  const renderMetadataCard = (type, item) => {
    const saveKey = `${type}-${item.id}`;
    const isSaving = !!savingItems[saveKey];
    const setter = type === 'category' ? setCategories : setCollections;

    const handleChange = (field, value) => {
      setter(prev => prev.map(entry => (entry.id === item.id ? { ...entry, [field]: value } : entry)));
    };

    return (
      <div key={item.id} className="p-5 border-b border-neutral-100 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-900">{item.name}</p>
            <p className="text-[10px] text-neutral-400 font-mono">slug: {item.slug}</p>
          </div>
          <button
            onClick={() => handleDelete(type, item.id)}
            className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className={`grid gap-4 ${type === 'collection' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
              Display Name
            </label>
            <input
              type="text"
              value={item.name || ''}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
              Slug
            </label>
            <input
              type="text"
              value={item.slug || ''}
              onChange={e => handleChange('slug', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-mono text-neutral-500"
            />
          </div>

          {type === 'category' && renderImageCard(type, item, 'image', 'Category Image')}
        </div>

        {type === 'collection' && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {renderImageCard(type, item, 'image', 'Primary Image')}
              {renderImageCard(type, item, 'hover_image', 'Hover Image')}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                Description
              </label>
              <textarea
                value={item.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm resize-none"
                placeholder="Add collection copy for the storefront"
              />
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => handleSave(type, item)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
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
            {categories.map(item => renderMetadataCard('category', item))}
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
            {collections.map(item => renderMetadataCard('collection', item))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Important Note:</strong> Category and collection visuals are now backend-managed.
          After uploading images here, save the item so the storefront can use the new metadata.
        </p>
      </div>
    </div>
  );
};
