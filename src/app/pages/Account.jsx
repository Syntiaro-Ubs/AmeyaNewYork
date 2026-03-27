import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, CreditCard, ShoppingBag, Gift, Power, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router';
export function Account() {
  const {
    user,
    logout
  } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  if (!user) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <div className="text-center max-w-md">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-serif mb-2">Login to access your account</h2>
          <p className="text-gray-500 mb-8">Sign in to view your profile, orders, and saved addresses.</p>
          <Link to="/login" className="bg-[var(--primary)] text-white px-8 py-3 uppercase tracking-wider text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors inline-block">
            Login Now
          </Link>
        </div>
      </div>;
  }
  const handleUpdateProfile = e => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };
  const menuItems = [{
    id: 'orders',
    label: 'My Orders',
    icon: ShoppingBag,
    path: '/orders'
  }, {
    id: 'profile',
    label: 'Profile Information',
    icon: User
  }, {
    id: 'addresses',
    label: 'Manage Addresses',
    icon: MapPin
  }, {
    id: 'pan',
    label: 'PAN Card Information',
    icon: CreditCard
  }, {
    id: 'payments',
    label: 'Saved Cards & Wallet',
    icon: Gift
  }];
  return <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 rounded-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 mb-1">Hello,</p>
                <h3 className="font-medium truncate">{user.name}</h3>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
              <div className="py-2">
                {menuItems.map(item => item.path ? <Link key={item.id} to={item.path} className="flex items-center justify-between w-full px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
                      <div className="flex items-center gap-3 text-gray-600 group-hover:text-[var(--primary)] font-medium">
                        <item.icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-[var(--primary)]" />
                    </Link> : <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center justify-between w-full px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group ${activeTab === item.id ? 'bg-blue-50/50 text-[var(--primary)]' : ''}`}>
                      <div className="flex items-center gap-3 text-gray-600 group-hover:text-[var(--primary)] font-medium">
                        <item.icon size={18} className={activeTab === item.id ? 'text-[var(--primary)]' : ''} />
                        <span className={`text-sm ${activeTab === item.id ? 'text-[var(--primary)] font-semibold' : ''}`}>{item.label}</span>
                      </div>
                      <ChevronRight size={16} className={activeTab === item.id ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'} />
                    </button>)}
                
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button onClick={() => {
                  logout();
                  navigate('/');
                }} className="flex items-center gap-3 w-full px-6 py-4 text-gray-600 hover:text-red-600 transition-colors">
                    <Power size={18} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.3
          }} className="bg-white p-6 md:p-8 shadow-sm rounded-sm min-h-[500px]">
              {activeTab === 'profile' && <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      Personal Information
                      <span className="text-xs font-normal text-[var(--primary)] cursor-pointer hover:underline ml-4">Edit</span>
                    </h2>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">First Name</label>
                        <input type="text" defaultValue={user.name.split(' ')[0]} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] rounded-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">Last Name</label>
                        <input type="text" defaultValue={user.name.split(' ')[1] || ''} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] rounded-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Gender</h3>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" className="accent-[var(--primary)]" defaultChecked />
                          <span className="text-sm">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" className="accent-[var(--primary)]" />
                          <span className="text-sm">Female</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">Email Address</label>
                      <div className="flex gap-4">
                        <input type="email" defaultValue={user.email} className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] rounded-sm" disabled />
                        <button type="button" className="text-xs text-[var(--primary)] font-medium hover:underline">Update</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">Mobile Number</label>
                      <div className="flex gap-4">
                        <input type="tel" defaultValue="+1 9876543210" className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] rounded-sm" />
                        <button type="button" className="text-xs text-[var(--primary)] font-medium hover:underline">Update</button>
                      </div>
                    </div>

                    <button type="submit" className="bg-[var(--primary)] text-white px-8 py-3 uppercase tracking-wider text-xs font-bold hover:bg-[var(--primary)]/90 transition-all shadow-sm rounded-sm mt-4">
                      Save Changes
                    </button>
                  </form>
                </div>}

              {activeTab === 'addresses' && <div>
                   <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold">Manage Addresses</h2>
                    <button className="text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/5 px-4 py-2 rounded-sm border border-[var(--primary)] transition-colors">
                      + Add New Address
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 p-6 relative group hover:shadow-md transition-shadow rounded-sm bg-white">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Edit2 size={14} /></button>
                        <button className="p-2 hover:bg-red-50 rounded-full text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm mb-3 inline-block">Home</span>
                      <div className="flex gap-4 items-start mb-2">
                        <span className="font-semibold text-sm">{user.name}</span>
                        <span className="text-sm text-gray-900 font-bold">+1 9876543210</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                        123 Luxury Avenue, Apartment 4B, Upper East Side,<br />
                        New York, NY 10021, United States
                      </p>
                    </div>

                    <div className="border border-gray-200 p-6 relative group hover:shadow-md transition-shadow rounded-sm bg-white">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Edit2 size={14} /></button>
                        <button className="p-2 hover:bg-red-50 rounded-full text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm mb-3 inline-block">Work</span>
                      <div className="flex gap-4 items-start mb-2">
                        <span className="font-semibold text-sm">{user.name}</span>
                        <span className="text-sm text-gray-900 font-bold">+1 9876543210</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                        AMEYA HQ, 5th Avenue, Fashion District,<br />
                        New York, NY 10018, United States
                      </p>
                    </div>
                  </div>
                </div>}

              {activeTab === 'pan' && <div>
                  <h2 className="text-lg font-semibold mb-8">PAN Card Information</h2>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm mb-6">
                    <p className="text-sm text-blue-800">For faster checkout during high-value transactions, please add your PAN card details.</p>
                  </div>
                  
                  <form className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">PAN Card Number</label>
                      <input type="text" placeholder="ABCDE1234F" className="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm uppercase focus:outline-none focus:border-[var(--primary)] rounded-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">Full Name on PAN Card</label>
                      <input type="text" placeholder="As per PAN card" className="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] rounded-sm" />
                    </div>
                    
                    <div className="pt-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-1 accent-[var(--primary)]" />
                        <span className="text-xs text-gray-500 leading-relaxed">
                          I declare that the PAN details provided are accurate and belong to me. I understand that providing false information may result in account termination.
                        </span>
                      </label>
                    </div>

                    <button type="button" className="bg-[var(--primary)] text-white px-8 py-3 uppercase tracking-wider text-xs font-bold hover:bg-[var(--primary)]/90 transition-all shadow-sm rounded-sm">
                      Upload PAN
                    </button>
                  </form>
                </div>}

              {activeTab === 'payments' && <div>
                  <h2 className="text-lg font-semibold mb-8">Saved Cards & Wallet</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Saved Cards</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 p-4 rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-300">VISA</div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">HDFC Bank Credit Card</p>
                              <p className="text-xs text-gray-500">Ending in 4242 • Expires 12/28</p>
                            </div>
                          </div>
                          <button className="text-xs text-red-500 hover:underline">Remove</button>
                        </div>
                        <button className="text-sm text-[var(--primary)] font-medium hover:underline flex items-center gap-2">
                          + Add New Card
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">UPI IDs</h3>
                      <div className="space-y-4">
                         <div className="border border-gray-200 p-4 rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">G</span>
                            </div>
                            <p className="text-sm font-medium text-gray-800">username@oksbi</p>
                          </div>
                          <button className="text-xs text-red-500 hover:underline">Remove</button>
                        </div>
                         <button className="text-sm text-[var(--primary)] font-medium hover:underline flex items-center gap-2">
                          + Add New UPI ID
                        </button>
                      </div>
                    </div>
                  </div>
                </div>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>;
}
