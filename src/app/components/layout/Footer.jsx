import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
export function Footer() {
  return <footer className="bg-[#f8f6f1] text-[var(--foreground)] pt-16 md:pt-24 pb-8 font-sans border-t border-[var(--border)] relative z-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-3xl tracking-widest font-medium text-[var(--primary)]">AMEYA</h2>
              <span className="block text-xs uppercase tracking-[0.3em] mt-1 text-black">New York</span>
            </Link>
            <p className="text-[var(--muted-foreground)] leading-relaxed text-sm mb-6">
              Timeless elegance crafted with precision. Each piece tells a story of luxury, heritage, and the vibrant spirit of New York City.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-[var(--primary)]">Jewelry</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <li><Link to="/products" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">All Products</Link></li>
              <li><Link to="/category/rings" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Rings</Link></li>
              <li><Link to="/category/earrings" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Earrings</Link></li>
              <li><Link to="/category/necklaces" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Necklaces</Link></li>
              <li><Link to="/category/bracelets" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Bracelets & Bangles</Link></li>
              <li><Link to="/category/love-engagement" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Love & Engagement</Link></li>
              <li><Link to="/category/sets" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Sets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 text-[var(--primary)]">Company</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <li><Link to="/our-story" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Careers</Link></li>
               <li><Link to="/journal" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Journal</Link></li>

            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 text-[var(--primary)]">Customer Care</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <li><Link to="/contact" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">FAQ</Link></li>
              <li><Link to="/care" className="hover:text-[var(--secondary)] active:text-[var(--primary)] transition-colors">Jewelry Care</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-lg mb-6 text-[var(--primary)]">The Newsletter</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-3 w-full max-w-md" onSubmit={e => e.preventDefault()}>
              <div className="relative">
                <input type="email" placeholder="Your email address" className="w-full bg-transparent border-b border-[var(--border)] py-2 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--muted-foreground)]/60 text-[var(--foreground)]" />
                <button type="submit" className="absolute right-0 top-2 text-[var(--muted-foreground)] hover:text-[var(--secondary)] transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--muted-foreground)]">
          <p> Designed And Developed By SYNTIARO.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-[var(--secondary)] active:text-[var(--primary)]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[var(--secondary)] active:text-[var(--primary)]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>;
}
