import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight, Mail, Lock, User, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import loginImage from '../../assets/collection/Love and Engagement/D1M.JPG';
export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const handleSubmit = e => {
    e.preventDefault();
    if (!isLogin && !agreeToTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      const userData = {
        id: isLogin ? '1' : Date.now().toString(),
        name: name || 'Valued Customer',
        email: email,
        phone: '',
        gender: '',
        addresses: []
      };
      login(userData);
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      navigate('/');
    }, 800);
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form fields when toggling
    setEmail('');
    setPassword('');
    setName('');
    setAgreeToTerms(false);
  };
  return <div className="min-h-screen pt-20 flex bg-[var(--background)]">
      
      {/* Left Side - Image (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 1
      }} className="absolute inset-0">
          <img src={loginImage} alt="Luxury Jewelry Model" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-12 left-12 text-white max-w-md">
            <h2 className="font-serif text-4xl mb-4 italic">"Elegance is not standing out, but being remembered."</h2>
            <p className="uppercase tracking-widest text-xs font-medium opacity-80">— AMEYA New York</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[var(--background)]">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] mb-3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm font-light">
              {isLogin ? 'Enter your details to access your account.' : 'Join us for an exclusive experience.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium block">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4 group-focus-within:text-[var(--primary)] transition-colors" />
                  <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-b border-[var(--border)] px-10 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors rounded-none placeholder:text-[var(--muted-foreground)]/50" placeholder="John Doe" required={!isLogin} />
                </div>
              </div>}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium block">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4 group-focus-within:text-[var(--primary)] transition-colors" />
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-[var(--border)] px-10 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors rounded-none placeholder:text-[var(--muted-foreground)]/50" placeholder="hello@example.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium block">
                  Password
                </label>
                {isLogin && <button type="button" onClick={() => toast.info("Password reset functionality would go here.")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                    Forgot Password?
                  </button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4 group-focus-within:text-[var(--primary)] transition-colors" />
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border-b border-[var(--border)] px-10 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors rounded-none placeholder:text-[var(--muted-foreground)]/50" placeholder="••••••••" required />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center justify-between pt-2">
              {isLogin ? <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${rememberMe ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)] group-hover:border-[var(--primary)]'}`}>
                    {rememberMe && <Check size={10} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                  <span className="text-xs text-[var(--muted-foreground)] select-none group-hover:text-[var(--foreground)] transition-colors">Remember me</span>
                </label> : <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${agreeToTerms ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)] group-hover:border-[var(--primary)]'}`}>
                    {agreeToTerms && <Check size={10} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={agreeToTerms} onChange={() => setAgreeToTerms(!agreeToTerms)} />
                  <span className="text-xs text-[var(--muted-foreground)] select-none group-hover:text-[var(--foreground)] transition-colors">
                    I agree to the <span className="underline hover:text-[var(--primary)]">Terms</span> & <span className="underline hover:text-[var(--primary)]">Privacy</span>
                  </span>
                </label>}
            </div>

            <div className="flex justify-center">
              <button type="submit" className="bg-[var(--primary)] text-white px-8 py-3 mt-8 uppercase tracking-widest text-xs font-medium hover:bg-[var(--primary)]/90 transition-all flex items-center justify-center gap-2 group rounded-sm shadow-sm hover:shadow-md">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--border)] text-center flex flex-col items-center gap-4">
            <p className="text-[var(--muted-foreground)] text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button onClick={toggleMode} className="text-[var(--foreground)] uppercase tracking-wider text-xs font-medium hover:text-[var(--primary)] transition-colors border-b border-transparent hover:border-[var(--primary)] pb-0.5 whitespace-nowrap">
              {isLogin ? 'Register Now' : 'Sign In Instead'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>;
}
