import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit,
  Upload, 
  Check, 
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

export const JournalManager = () => {
  const [articles, setArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    read_time: '',
    excerpt: '',
    content: '',
    is_featured: false,
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/journal');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch journal articles', error);
      toast.error('Failed to fetch articles');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ 
        ...formData, 
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      read_time: '',
      excerpt: '',
      content: '',
      is_featured: false,
      image: null,
      imagePreview: null
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      category: article.category,
      read_time: article.read_time,
      excerpt: article.excerpt,
      content: article.content,
      is_featured: !!article.is_featured,
      image: null,
      imagePreview: article.image_url ? `http://localhost:5000${article.image_url}` : null
    });
    setEditingId(article.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('read_time', formData.read_time);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('content', formData.content);
    submitData.append('is_featured', formData.is_featured);
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const url = editingId 
        ? `http://localhost:5000/api/journal/${editingId}`
        : 'http://localhost:5000/api/journal';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData
      });

      if (response.ok) {
        toast.success(`Article ${editingId ? 'updated' : 'created'} successfully`);
        resetForm();
        fetchArticles();
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to save article');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/journal/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          toast.success('Article deleted');
          fetchArticles();
        } else {
          toast.error('Failed to delete article');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-neutral-900">Journal Articles</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your blog posts and journal entries.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-neutral-400">
            <FileText className="w-10 h-10 mb-3 opacity-20" />
            <p>No articles added yet.</p>
          </div>
        ) : articles.map(article => (
          <div key={article.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="aspect-[4/3] relative bg-neutral-100">
              {article.image_url ? (
                <img src={`http://localhost:5000${article.image_url}`} alt={article.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <FileText className="w-12 h-12" />
                </div>
              )}
              {article.is_featured ? (
                <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white rounded text-[10px] uppercase font-bold tracking-widest">
                  Featured
                </div>
              ) : null}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white rounded text-[10px] uppercase font-bold tracking-widest">
                {article.category}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-serif text-lg text-neutral-900 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-neutral-500 mb-4 line-clamp-3 flex-1">{article.excerpt}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">{article.read_time}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(article)} className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={resetForm}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-medium text-neutral-900">{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={resetForm} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <form id="articleForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Title *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Article Title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Category *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. Style Guide"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Read Time</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                          value={formData.read_time}
                          onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                          placeholder="e.g. 5 min read"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Excerpt</label>
                      <textarea
                        rows="3"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm resize-none"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Short description for the card..."
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      <input
                        type="checkbox"
                        id="is_featured"
                        className="w-4 h-4 text-neutral-900 rounded focus:ring-neutral-900"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      />
                      <label htmlFor="is_featured" className="text-sm font-medium text-neutral-900 cursor-pointer">
                        Mark as Featured Article
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex flex-col">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Cover Image {editingId ? '' : '*'}</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 border-dashed rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors relative overflow-hidden group">
                        {formData.imagePreview ? (
                          <>
                            <img src={formData.imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Change Image</span>
                            </div>
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                          </>
                        ) : (
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-10 w-10 text-neutral-300" />
                            <div className="flex text-sm text-neutral-600 justify-center">
                              <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-neutral-900 hover:text-neutral-700">
                                <span>Upload a file</span>
                                <input type="file" className="sr-only" onChange={handleFileChange} required={!editingId} />
                              </label>
                            </div>
                            <p className="text-xs text-neutral-400">PNG, JPG, WEBP up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Article Content *</label>
                  <textarea
                    required
                    rows="10"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-mono leading-relaxed"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article content here... (Supports basic text formatting)"
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex gap-3 shrink-0">
              <button type="button" onClick={resetForm} className="flex-1 px-4 py-3 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50">Cancel</button>
              <button type="submit" form="articleForm" className="flex-[2] px-4 py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-neutral-800">
                {editingId ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
