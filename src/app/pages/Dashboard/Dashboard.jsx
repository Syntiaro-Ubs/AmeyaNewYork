import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Products } from './Products';
import { ShoptheLook } from './ShoptheLook';
import { Banner } from './Banner';
import { HomepageEditor } from './HomepageEditor';
import { TaxonomyManager } from './TaxonomyManager';
import { UserManager } from './UserManager';
import { OrderManagement } from './OrderManagement';

export const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
  let userPermissions = userData.permissions || [];
  
  // Proactively add 'orders' permission if it's the main admin
  if (userData.role === 'admin' && !userPermissions.includes('orders')) {
    userPermissions = [...userPermissions, 'orders'];
  }

  const allTabs = [
    { id: 'products', label: 'Products', permission: 'products' },
    { id: 'orders', label: 'Orders', permission: 'orders' },
    { id: 'editorial', label: 'Shop the Look', permission: 'editorial' },
    { id: 'banners', label: 'Banners', permission: 'banners' },
    { id: 'homepage', label: 'Homepage', permission: 'homepage' },
    { id: 'taxonomy', label: 'Collections & Categories', permission: 'taxonomy' },
    { id: 'users', label: 'User Management', permission: 'users' }
  ];

  const allowedTabs = allTabs.filter(tab => userPermissions.includes(tab.permission));
  const [activeTab, setActiveTab] = useState(allowedTabs.length > 0 ? allowedTabs[0].id : ''); 

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/dashboard/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light text-neutral-900 tracking-tight">
              {activeTab === 'products' ? 'Product Management' : 
               activeTab === 'orders' ? 'Order & Tracking' : 
               activeTab === 'editorial' ? 'Shop the Look Management' : 
               activeTab === 'banners' ? 'Global Banner Management' : 
               activeTab === 'homepage' ? 'Homepage Customization' : 
                activeTab === 'taxonomy' ? 'Collections & Categories' : 'User Management'}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {activeTab === 'products' ? 'Manage your jewelry inventory from here.' : 
               activeTab === 'orders' ? 'Manage customer orders and update tracking status.' : 
               activeTab === 'editorial' ? 'Manage lifestyle editorial cards for category pages.' : 
               activeTab === 'banners' ? 'Manage hero images and videos for all pages.' :
               activeTab === 'homepage' ? 'Edit home page sections, titles, and media dynamically.' :
               activeTab === 'taxonomy' ? 'Define and manage your website taxonomy (Collections & Categories).' :
               'Manage administrative access and team members for the dashboard.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-white text-neutral-900 border border-neutral-200 text-sm font-medium rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
              title="Logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-neutral-200 mb-8">
          {allowedTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"></div>}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="mt-6">
          {allowedTabs.find(t => t.id === activeTab) ? (
            activeTab === 'products' ? <Products /> :
            activeTab === 'orders' ? <OrderManagement /> :
            activeTab === 'editorial' ? <ShoptheLook /> :
            activeTab === 'banners' ? <Banner /> :
            activeTab === 'homepage' ? <HomepageEditor /> :
            activeTab === 'taxonomy' ? <TaxonomyManager /> :
            activeTab === 'users' ? <UserManager /> :
            <div className="py-20 text-center text-neutral-400">Select a section to manage.</div>
          ) : (
            <div className="py-20 text-center text-neutral-400 font-medium italic">
              Access Denied. You do not have permission to view this section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
