import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Shield, User, Loader2, Edit2, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AUTH_API = 'http://localhost:5000/api/auth';

const AVAILABLE_PERMISSIONS = [
  { id: 'products', label: 'Products' },
  { id: 'editorial', label: 'Shop the Look' },
  { id: 'banners', label: 'Banners' },
  { id: 'homepage', label: 'Homepage' },
  { id: 'taxonomy', label: 'Collections & Categories' },
  { id: 'users', label: 'User Management' }
];

export const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    permissions: AVAILABLE_PERMISSIONS.map(p => p.id) 
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePermissionChange = (permId) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: isSelected 
          ? prev.permissions.filter(p => p !== permId)
          : [...prev.permissions, permId]
      };
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_API}/users`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingUser ? `${AUTH_API}/users/${editingUser.id}` : `${AUTH_API}/register-admin`;
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(editingUser ? 'User updated successfully' : 'Admin user added successfully');
        setFormData({ name: '', email: '', password: '', permissions: AVAILABLE_PERMISSIONS.map(p => p.id) });
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Kept empty to indicate no change
      permissions: user.permissions || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteUser = async (id, email) => {
    // Basic protection against self-deletion (simple check against local storage email)
    const currentUserEmail = localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')).email : null;
    
    if (email === currentUserEmail) {
      toast.error('You cannot delete your own account while logged in');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${email} from administrators?`)) return;

    try {
      const res = await fetch(`${AUTH_API}/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('User access revoked');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Create or Edit Admin Form */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm transition-all duration-500">
        <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
          {editingUser ? <Shield className="w-5 h-5 text-neutral-400" /> : <UserPlus className="w-5 h-5 text-neutral-400" />}
          {editingUser ? `Editing Administrator: ${editingUser.name}` : 'Add New Team Administrator'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
              <input 
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
              <input 
                type="email"
                placeholder="jane@ameyanewyork.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
              {editingUser ? 'New Password (Optional)' : 'Temporary Password'}
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder={editingUser ? "Leave blank to keep current" : "••••••••"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm"
                required={!editingUser}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="md:col-span-4 space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1 block">Dashboard Access Selection</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {AVAILABLE_PERMISSIONS.map(perm => (
                <label 
                  key={perm.id} 
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                    formData.permissions.includes(perm.id) 
                      ? 'bg-neutral-900 border-neutral-900 text-white shadow-md' 
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  <input 
                    type="checkbox"
                    className="sr-only"
                    checked={formData.permissions.includes(perm.id)}
                    onChange={() => handlePermissionChange(perm.id)}
                  />
                  <span className="text-[10px] font-medium uppercase tracking-tight">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {editingUser && (
              <button 
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ name: '', email: '', password: '', permissions: AVAILABLE_PERMISSIONS.map(p => p.id) });
                }}
                className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-600 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              disabled={submitting}
              className={`flex-[2] px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingUser ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />} 
              {editingUser ? 'Save Updates' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Admin List */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden text-[10px] font-light">
        <div className="px-6 py-5 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
            <Shield size={14} className="text-neutral-400" /> Administrative Team
          </h3>
          <span className="text-neutral-400 font-medium italic">{users.length} active admins</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-50">
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Full Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Permissions</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {users.map((u) => (
                <tr key={u.id} className="group hover:bg-neutral-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-neutral-900">{u.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-500">{u.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {u.permissions && u.permissions.length > 0 ? (
                        u.permissions.map(p => (
                          <span key={p} className="px-1.5 py-0.5 bg-neutral-100 text-[8px] font-bold text-neutral-400 rounded uppercase tracking-tighter border border-neutral-200">
                            {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[8px] text-neutral-300 italic">No access</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-neutral-100 text-[10px] font-bold text-neutral-500 rounded-full uppercase tracking-tighter">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(u)}
                        className="p-2 text-neutral-300 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Access"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex gap-4">
        <Shield className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-blue-900">Security Notice</h4>
          <p className="text-xs text-blue-700 leading-relaxed max-w-2xl">
            You are managing administrative access to the Ameya New York dashboard. Only share credentials with trusted team members. 
            All admins have full access to modify products, homepage sections, and banner management. 
            Removing a user will instantly revoke their dashboard access.
          </p>
        </div>
      </div>
    </div>
  );
};
