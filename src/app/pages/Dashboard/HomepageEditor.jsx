import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  Layout, 
  Instagram, 
  Star, 
  Grid, 
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { safeJsonParse } from '../../utils/json';

const API_BASE = 'http://localhost:5000/api/homepage';
const UPLOAD_API = 'http://localhost:5000/api/homepage/upload';

// Fetch dynamic data from products table

export const HomepageEditor = () => {
  const [sections, setSections] = useState([]);
  const [availableCollections, setAvailableCollections] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('featured-collections');
  const [savingSections, setSavingSections] = useState({});

  useEffect(() => {
    fetchSections();
    fetchAvailableCollections();
    fetchAvailableCategories();
  }, []);

  const fetchAvailableCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories/available`);
      const data = await response.json();
      setAvailableCategories(data);
    } catch (error) {
      console.error('Failed to fetch available categories:', error);
    }
  };

  const fetchAvailableCollections = async () => {
    try {
      const response = await fetch(`${API_BASE}/collections/available`);
      const data = await response.json();
      setAvailableCollections(data);
    } catch (error) {
      console.error('Failed to fetch available collections:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin`);
      const data = await response.json();
      setSections(data);
    } catch (error) {
      toast.error('Failed to fetch homepage settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (slug, field, value) => {
    setSections(prev => prev.map(s => 
      s.section_slug === slug ? { ...s, [field]: value } : s
    ));
  };

  const handleContentJsonChange = (slug, value) => {
    setSections(prev => prev.map(s => 
      s.section_slug === slug ? { ...s, content_json: JSON.stringify(value) } : s
    ));
  };

  const handleFileUpload = async (slug, file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(UPLOAD_API, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        handleInputChange(slug, 'media_url', data.media_url);
        toast.success('Media uploaded successfully');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload error');
    }
  };

  const handleSave = async (slug) => {
    const section = sections.find(s => s.section_slug === slug);
    
    // Custom validation for Exclusive Collection
    if (slug === 'featured-collections') {
      const content = section.content_json ? JSON.parse(section.content_json) : [];
      if (content.length !== 2) {
        toast.error('Please select exactly 2 collections to save this section.');
        return;
      }
    }

    setSavingSections(prev => ({ ...prev, [slug]: true }));

    try {
      const response = await fetch(`${API_BASE}/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
      });

      if (response.ok) {
        toast.success(`${section.section_name} updated`);
      } else {
        toast.error('Failed to save changes');
      }
    } catch (error) {
      toast.error('Save error');
    } finally {
      setSavingSections(prev => ({ ...prev, [slug]: false }));
    }
  };

  const getSectionIcon = (slug) => {
    switch (slug) {
      case 'hero': return <Layout className="w-5 h-5" />;
      case 'instagram-feed': return <Instagram className="w-5 h-5" />;
      case 'product-spotlight': return <Star className="w-5 h-5" />;
      default: return <Grid className="w-5 h-5" />;
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500 font-light">Loading Editor...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-neutral-900 mb-2">Homepage Editor</h1>
        <p className="text-neutral-500 font-light">Customize every section of your dream luxury store front.</p>
      </div>

      <div className="space-y-6">
        {sections.filter(s => s.section_slug !== 'hero').map(section => {
          const isExpanded = expandedSection === section.section_slug;
          const isSaving = savingSections[section.section_slug];
          const content = safeJsonParse(section.content_json);

          return (
            <div key={section.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden transition-all duration-300">
              {/* Accordion Header */}
              <div 
                className={`p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors ${isExpanded ? 'border-b border-neutral-100 bg-neutral-50/30' : ''}`}
                onClick={() => setExpandedSection(isExpanded ? null : section.section_slug)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isExpanded ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                    {getSectionIcon(section.section_slug)}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">{section.section_name}</h3>
                    <p className="text-xs text-neutral-400 font-light">Manage {section.section_slug.replace('-', ' ')} content</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!section.is_visible && (
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-red-400 bg-red-50 px-2.5 py-1 rounded-full">
                      <EyeOff size={12} /> Hidden
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="text-neutral-300" /> : <ChevronDown className="text-neutral-300" />}
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-5">
                        {(section.section_slug !== 'collection-cards' && section.section_slug !== 'category-grid' && section.section_slug !== 'product-spotlight' && section.section_slug !== 'brand-story') && (
                          <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                              <Type size={14} className="text-neutral-400" /> Section Title
                            </label>
                            <input 
                              type="text" 
                              value={section.title || ''} 
                              onChange={(e) => handleInputChange(section.section_slug, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-light"
                            />
                          </div>
                        )}
                        {(section.section_slug !== 'featured-collections' && section.section_slug !== 'collection-cards' && section.section_slug !== 'category-grid' && section.section_slug !== 'product-spotlight' && section.section_slug !== 'brand-story') && (
                          <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                              {section.section_slug === 'instagram-feed' ? <Instagram size={14} className="text-neutral-400" /> : <ImageIcon size={14} className="text-neutral-400" />} Subtitle / Eyebrow
                            </label>
                            <input 
                              type="text" 
                              value={section.subtitle || ''} 
                              onChange={(e) => handleInputChange(section.section_slug, 'subtitle', e.target.value)}
                              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-light"
                            />
                          </div>
                        )}
                        {section.section_slug === 'hero' && (
                          <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                              <LinkIcon size={14} className="text-neutral-400" /> Link URL
                            </label>
                            <input 
                              type="text" 
                              value={section.link_url || ''} 
                              onChange={(e) => handleInputChange(section.section_slug, 'link_url', e.target.value)}
                              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-light"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              checked={section.is_visible} 
                              onChange={(e) => handleInputChange(section.section_slug, 'is_visible', e.target.checked)}
                              className="sr-only" 
                            />
                            <div className={`block w-12 h-7 rounded-full transition-colors ${section.is_visible ? 'bg-emerald-500' : 'bg-neutral-200'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${section.is_visible ? 'translate-x-5' : ''}`}></div>
                          </div>
                          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">
                            {section.is_visible ? 'Section is visible' : 'Section is hidden from public'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Media & JSON Content */}
                    <div className="space-y-6">
                      {/* Media Upload */}
                      {section.section_slug === 'hero' && (
                        <div>
                          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Featured Media</label>
                          <div className="relative aspect-[16/9] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 border-dashed group">
                            {section.media_url ? (
                              <img 
                                src={section.media_url.startsWith('http') || section.media_url.startsWith('/src') ? section.media_url : `http://localhost:5000${section.media_url}`} 
                                className="w-full h-full object-cover" 
                                alt="Preview" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <ImageIcon className="text-neutral-300 w-10 h-10" />
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium border border-white/30">
                                <Upload size={14} /> Replace Image
                              </div>
                              <input 
                                type="file" 
                                className="sr-only" 
                                onChange={(e) => handleFileUpload(section.section_slug, e.target.files[0])} 
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Collection / Category Selector */}
                      {(section.section_slug === 'featured-collections' || section.section_slug === 'collection-cards' || section.section_slug === 'category-grid' || section.section_slug === 'brand-story' || section.section_slug === 'product-spotlight') && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                              {(section.section_slug === 'featured-collections' || section.section_slug === 'product-spotlight' || section.section_slug === 'brand-story') ? 'Step 1: Select 2 Base Collections' : 
                               (section.section_slug === 'category-grid' || section.section_slug === 'collection-cards') ? 'Step 1: Select Items' : 'Feature Collections'}
                            </label>
                            {(section.section_slug === 'featured-collections' || section.section_slug === 'product-spotlight' || section.section_slug === 'brand-story') && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${content?.length === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {content?.length || 0} / 2 Selected
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
                            {(section.section_slug === 'category-grid' ? availableCategories : availableCollections).map(itemName => {
                              const isSelected = Array.isArray(content) && content.some(item => (typeof item === 'string' ? item === itemName : item.slug === itemName));
                              return (
                                <button
                                  key={itemName}
                                  type="button"
                                   onClick={() => {
                                    const isFeatured = section.section_slug === 'featured-collections';
                                    const isCards = section.section_slug === 'collection-cards';
                                    const isCategoryGrid = section.section_slug === 'category-grid';
                                    const isSpotlight = section.section_slug === 'product-spotlight';
                                    const isBrandStory = section.section_slug === 'brand-story';
                                    
                                    if (!isSelected && isFeatured && content?.length >= 2) {
                                      toast.warning('The Exclusive Collection requires exactly 2 items.');
                                      return;
                                    }

                                    if (!isSelected && isSpotlight && content?.length >= 2) {
                                      toast.warning('The SpotLight section requires exactly 2 collections.');
                                      return;
                                    }

                                    if (!isSelected && isBrandStory && content?.length >= 2) {
                                      toast.warning('The Signature Collections section requires exactly 2 collections.');
                                      return;
                                    }

                                    let newContent;
                                    if (isSelected) {
                                      newContent = content.filter(item => (typeof item === 'string' ? item !== itemName : item.slug !== itemName));
                                    } else {
                                      const newItem = (isFeatured || isCards || isCategoryGrid || isSpotlight) ? { slug: itemName, image: '', description: '' } : itemName;
                                      newContent = [...(content || []), newItem];
                                    }
                                    handleContentJsonChange(section.section_slug, newContent);
                                  }}
                                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' : 'border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-300'}`}
                                >
                                  <span className="truncate mr-2 capitalize">{itemName.replace(/-/g, ' ')}</span>
                                  {isSelected && <Check size={12} />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Step 2: Custom Overrides for Collections & Categories */}
                          {(section.section_slug === 'featured-collections' || section.section_slug === 'collection-cards' || section.section_slug === 'category-grid' || section.section_slug === 'product-spotlight' || section.section_slug === 'brand-story') && content?.length > 0 && (
                            <div className="space-y-6 pt-6 border-t border-neutral-100">
                              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-4">
                                Step 2: Customize Visuals & Text
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.map((item, idx) => {
                                  const itemObj = typeof item === 'string' ? { slug: item, image: '', description: '' } : item;
                                  
                                  return (
                                    <div key={idx} className="bg-neutral-50/50 rounded-2xl p-4 border border-neutral-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-neutral-100">
                                          {itemObj.slug}
                                        </span>
                                      </div>

                                      <div className="space-y-3">
                                        {/* Custom Image */}
                                        <div className="relative aspect-video bg-white rounded-lg overflow-hidden border border-neutral-200 group">
                                          {itemObj.image ? (
                                            <img 
                                              src={itemObj.image.startsWith('http') || itemObj.image.startsWith('/src') ? itemObj.image : `http://localhost:5000${itemObj.image}`} 
                                              className="w-full h-full object-cover" 
                                              alt="Override" 
                                            />
                                          ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-neutral-300">
                                              <ImageIcon size={18} />
                                              <span className="text-[9px] mt-1 font-medium">Default will be used</span>
                                            </div>
                                          )}
                                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <div className="flex items-center gap-1.5 text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-medium border border-white/20">
                                              <Upload size={10} /> {itemObj.image ? 'Change' : 'Upload Image'}
                                            </div>
                                            <input 
                                              type="file" 
                                              className="sr-only" 
                                              onChange={async (e) => {
                                                const file = e.target.files[0];
                                                const formDataFiles = new FormData();
                                                formDataFiles.append('image', file);
                                                const res = await fetch(UPLOAD_API, { method: 'POST', body: formDataFiles });
                                                const data = await res.json();
                                                if (res.ok) {
                                                  const newContent = [...content];
                                                  newContent[idx] = { ...itemObj, image: data.media_url };
                                                  handleContentJsonChange(section.section_slug, newContent);
                                                }
                                              }}
                                            />
                                          </label>
                                        </div>

                                        {/* Custom Description (Only for Specific Sections) */}
                                        {(section.section_slug === 'featured-collections' || section.section_slug === 'brand-story') && (
                                          <textarea 
                                            value={itemObj.description || ''} 
                                            onChange={(e) => {
                                              const newContent = [...content];
                                              newContent[idx] = { ...itemObj, description: e.target.value };
                                              handleContentJsonChange(section.section_slug, newContent);
                                            }}
                                            placeholder="Custom marketing copy..."
                                            className="w-full h-20 px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 text-[10px] font-light resize-none"
                                          />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {(section.section_slug === 'featured-collections' || section.section_slug === 'product-spotlight' || section.section_slug === 'brand-story') && (content?.length !== 2) && (
                            <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50/50 p-2 rounded-lg">
                              <AlertCircle size={12} />
                              Please select exactly 2 collections to save this section.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Instagram Feed Editor */}
                      {section.section_slug === 'instagram-feed' && (
                        <div>
                          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 block">
                            Feed Grid (6 Managed Posts)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, idx) => {
                              const item = (Array.isArray(content) && content[idx]) || { image: '', link: '' };
                              const itemObj = typeof item === 'string' ? { image: item, link: '' } : item;
                              const displayImg = itemObj.image;

                              return (
                                <div key={idx} className="space-y-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-100">
                                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-neutral-200 group">
                                    {displayImg ? (
                                      <img 
                                        src={displayImg.startsWith('/src') ? displayImg : `http://localhost:5000${displayImg}`} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-neutral-300">
                                        <ImageIcon size={24} />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <label className="p-2 bg-white text-neutral-900 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                        <Upload size={16} />
                                        <input 
                                          type="file" 
                                          className="sr-only" 
                                          onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            const res = await fetch(UPLOAD_API, { method: 'POST', body: formData });
                                            const data = await res.json();
                                            if (res.ok) {
                                              const newArr = Array.isArray(content) ? [...content] : [];
                                              while (newArr.length < 6) newArr.push({ image: '', link: '' });
                                              newArr[idx] = { ...itemObj, image: data.media_url };
                                              handleContentJsonChange(section.section_slug, newArr);
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Redirect Link</label>
                                    <input 
                                      type="text"
                                      placeholder="https://..."
                                      value={itemObj.link || ''}
                                      onChange={(e) => {
                                        const newArr = Array.isArray(content) ? [...content] : [];
                                        while (newArr.length < 6) newArr.push({ image: '', link: '' });
                                        newArr[idx] = { ...itemObj, link: e.target.value };
                                        handleContentJsonChange(section.section_slug, newArr);
                                      }}
                                      className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 text-[10px] font-light"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Footer */}
                  <div className="pt-8 border-t border-neutral-100 flex justify-end">
                    <button 
                      onClick={() => handleSave(section.section_slug)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-neutral-200"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {isSaving ? 'Saving Changes...' : `Save ${section.section_name}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
