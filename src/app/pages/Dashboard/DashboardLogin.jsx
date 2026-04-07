import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, ArrowRight, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AUTH_URL = 'http://localhost:5000/api/auth';

export const DashboardLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        toast.success('Welcome back, Admin');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
        setShowForgot(false);
      } else {
        toast.error(data.message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-[0.2em] text-white">AMEYA</h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mt-2">Dashboard Management</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full"></div>
          
          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white">Admin Login</h2>
                <p className="text-sm text-neutral-400">Enter your credentials to access the dashboard.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-neutral-500" strokeWidth={1.5} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    placeholder="admin@ameya.com"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-neutral-500" strokeWidth={1.5} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-amber-500/80 transition-colors focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white flex items-center">
                  <KeyRound className="w-5 h-5 mr-2 text-amber-500" />
                  Recover Password
                </h2>
                <p className="text-sm text-neutral-400">Enter your email and we'll send you a reset link.</p>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-neutral-500" strokeWidth={1.5} />
                </span>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="admin@ameya.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-amber-500 text-black text-sm font-semibold rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full py-3 px-4 bg-transparent text-neutral-400 text-sm font-medium rounded-xl hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
        
        <p className="mt-8 text-center text-neutral-600 text-[10px] uppercase tracking-widest">
          Authorized personnel only. Protected by AMEYA-NY security systems.
        </p>
      </div>
    </div>
  );
};
