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
import { BANNERS_API_URL } from './constants';
const HP_API_BASE = 'http://localhost:5000/api/homepage';

export const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({
    page_slug: '',
    media_type: 'image',
    focal_point: 'center 40%',
    media: null
  });

  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  useEffect(() => {
    fetchBanners();
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

  const fetchBanners = async () => {
    try {
      const response = await fetch(BANNERS_API_URL);
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
    }
  };

  const handleBannerFileChange = (e) => {
    setBannerFormData({ ...bannerFormData, media: e.target.files[0] });
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('page_slug', bannerFormData.page_slug);
    submitData.append('media_type', bannerFormData.media_type);
    submitData.append('focal_point', bannerFormData.focal_point);
    submitData.append('media', bannerFormData.media);

    try {
      const response = await fetch(BANNERS_API_URL, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        toast.success('Banner updated successfully');
        setIsBannerModalOpen(false);
        fetchBanners();
        setBannerFormData({ page_slug: '', media_type: 'image', focal_point: 'center 40%', media: null });
      } else {
        toast.error('Failed to update banner');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleBannerDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        const response = await fetch(`${BANNERS_API_URL}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          toast.success('Banner deleted');
          fetchBanners();
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  return (
    <>
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setIsBannerModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Update Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-neutral-400">
            <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
            <p>No banners added yet.</p>
          </div>
        ) : banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-video relative bg-neutral-900">
              {banner.media_type === 'video' ? (
                <video src={`http://localhost:5000${banner.media_url}`} className="w-full h-full object-cover" muted loop autoPlay />
              ) : (
                <img src={`http://localhost:5000${banner.media_url}`} alt="Banner" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleBannerDelete(banner.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white uppercase font-bold tracking-widest">{banner.media_type}</div>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Target Page</p>
              <p className="text-sm font-medium text-neutral-900 capitalize">
                {dynamicCategories.find(c => c.slug === banner.page_slug)?.name || dynamicCollections.find(c => c.slug === banner.page_slug)?.name || banner.page_slug}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsBannerModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-medium text-neutral-900">Manage Hero Banner</h2>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBannerSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Apply to Page</label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                  value={bannerFormData.page_slug}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, page_slug: e.target.value })}
                >
                  <option value="">Select Page</option>
                  <option value="home">Home Page</option>
                  <option value="new-arrivals">New Arrivals</option>
                  <optgroup label="Categories">
                    {dynamicCategories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                  </optgroup>
                  <optgroup label="Collections">
                    {dynamicCollections.map(col => <option key={col.slug} value={col.slug}>{col.name}</option>)}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Media Type</label>
                  <select
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                    value={bannerFormData.media_type}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, media_type: e.target.value })}
                  >
                    <option value="image">Static Image</option>
                    <option value="video">Hero Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Focal Point</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                    placeholder="center 40%"
                    value={bannerFormData.focal_point}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, focal_point: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Upload Media</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 border-dashed rounded-2xl bg-neutral-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-neutral-300" />
                    <div className="flex text-sm text-neutral-600 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-neutral-900 hover:text-neutral-700">
                        <span>Upload media file</span>
                        <input type="file" className="sr-only" onChange={handleBannerFileChange} required />
                      </label>
                    </div>
                    <p className="text-xs text-neutral-400">JPG, PNG, MP4, MOV up to 50MB</p>
                    {bannerFormData.media && (
                      <p className="text-xs text-emerald-600 font-medium flex items-center justify-center mt-2">
                        <Check className="w-3 h-3 mr-1" /> {bannerFormData.media.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsBannerModalOpen(false)} className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl">Cancel</button>
                <button type="submit" className="flex-[2] px-4 py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl shadow-lg">Upload Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
