import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Check, 
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { EDITORIAL_API_URL } from './constants';
const HP_API_BASE = 'http://localhost:5000/api/homepage';

export const ShoptheLook = () => {
  const [activeSubTab, setActiveSubTab] = useState('categories'); // 'categories' or 'collections'
  const [editorialCards, setEditorialCards] = useState([]);
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [editorialFormData, setEditorialFormData] = useState({
    target_slug: '',
    display_order: 0,
    image: null
  });

  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  useEffect(() => {
    fetchEditorial();
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

  const fetchEditorial = async () => {
    try {
      const response = await fetch(EDITORIAL_API_URL);
      const data = await response.json();
      setEditorialCards(data);
    } catch (error) {
      console.error('Failed to fetch editorial cards', error);
    }
  };

  const handleEditorialFileChange = (e) => {
    setEditorialFormData({ ...editorialFormData, image: e.target.files[0] });
  };

  const handleEditorialSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('target_slug', editorialFormData.target_slug);
    submitData.append('display_order', editorialFormData.display_order);
    submitData.append('image', editorialFormData.image);

    try {
      const response = await fetch(EDITORIAL_API_URL, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        toast.success('Editorial card added');
        setIsEditorialModalOpen(false);
        fetchEditorial();
        setEditorialFormData({ target_slug: '', display_order: 0, image: null });
      }
    } catch (error) {
      toast.error('Failed to add editorial');
    }
  };

  const handleEditorialDelete = async (id) => {
    if (window.confirm('Delete this editorial card?')) {
      try {
        const response = await fetch(`${EDITORIAL_API_URL}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          toast.success('Editorial deleted');
          fetchEditorial();
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  const filteredCards = editorialCards.filter(card => {
    const belongsToCategory = dynamicCategories.some(cat => cat.slug === card.target_slug);
    return activeSubTab === 'categories' ? belongsToCategory : !belongsToCategory;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeSubTab === 'categories' ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-900'}`}
          >
            Category Editorials
          </button>
          <button
            onClick={() => setActiveSubTab('collections')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeSubTab === 'collections' ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-900'}`}
          >
            Collection Editorials
          </button>
        </div>
        <button
          onClick={() => setIsEditorialModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Editorial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-neutral-400">
            <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
            <p>No {activeSubTab} editorials added yet.</p>
          </div>
        ) : filteredCards.map(card => (
          <div key={card.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-[3/4] relative">
              <img src={`http://localhost:5000${card.image_url}`} alt="Editorial" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleEditorialDelete(card.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Target Page</p>
                <p className="text-sm font-medium text-neutral-900 capitalize">
                  {dynamicCategories.find(c => c.slug === card.target_slug)?.name || dynamicCollections.find(c => c.slug === card.target_slug)?.name || card.target_slug}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Order</p>
                <p className="text-sm font-medium text-neutral-900">{card.display_order}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editorial Modal */}
      {isEditorialModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsEditorialModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-medium text-neutral-900">Add Editorial Card</h2>
              <button onClick={() => setIsEditorialModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditorialSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Target Page</label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                  value={editorialFormData.target_slug}
                  onChange={(e) => setEditorialFormData({ ...editorialFormData, target_slug: e.target.value })}
                >
                  <option value="">Select Category or Collection</option>
                  <optgroup label="Categories">
                    {dynamicCategories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                  </optgroup>
                  <optgroup label="Collections">
                    {dynamicCollections.map(col => <option key={col.slug} value={col.slug}>{col.name}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Display Order</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                  value={editorialFormData.display_order}
                  onChange={(e) => setEditorialFormData({ ...editorialFormData, display_order: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Editorial Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 border-dashed rounded-2xl bg-neutral-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-neutral-300" />
                    <div className="flex text-sm text-neutral-600">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-neutral-900 hover:text-neutral-700">
                        <span>Upload image</span>
                        <input type="file" className="sr-only" onChange={handleEditorialFileChange} required />
                      </label>
                    </div>
                    {editorialFormData.image && (
                      <p className="text-xs text-emerald-600 font-medium flex items-center justify-center mt-2">
                        <Check className="w-3 h-3 mr-1" /> {editorialFormData.image.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditorialModalOpen(false)} className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl">Cancel</button>
                <button type="submit" className="flex-[2] px-4 py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl shadow-lg">Save Editorial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
