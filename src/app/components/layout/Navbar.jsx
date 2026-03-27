import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Search, ShoppingBag, User, Menu, MessageCircle, LogOut, Package } from 'lucide-react';
import { SearchOverlay } from '../ui/SearchOverlay';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '../ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    logout
  } = useAuth();
  const {
    cartCount
  } = useCart();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sheet on route change
  useEffect(() => {
    setIsSheetOpen(false);
  }, [location]);
  return <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[var(--background)]/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Left Side: Hamburger & Search */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger className="p-2 hover:text-[var(--primary)] transition-colors">
                <Menu size={24} strokeWidth={1} />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle className="font-serif text-2xl text-[var(--primary)]">AMEYA</SheetTitle>
                  <SheetDescription className="sr-only">Navigation Menu</SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col space-y-2">
                  <Link to="/category/new-arrivals" className="py-4 text-base font-medium border-b border-[var(--border)] hover:text-[var(--primary)] transition-colors uppercase tracking-wider">
                    All Jewelry
                  </Link>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="collections" className="border-b border-[var(--border)]">
                      <AccordionTrigger className="uppercase tracking-wider hover:text-[var(--primary)] text-base font-medium hover:no-underline">
                        Collections
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-4 py-2 pl-4">
                          <Link to="/collection/eclat-initial" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Eclat Initial</Link>
                          <Link to="/collection/eleve" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Eleve</Link>
                          <Link to="/collection/love-engagement" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Love and Engagement</Link>
                          <Link to="/collection/apex-spark" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Apex Spark</Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="categories" className="border-b border-[var(--border)]">
                      <AccordionTrigger className="uppercase tracking-wider hover:text-[var(--primary)] text-base font-medium hover:no-underline">
                        Shop by Category
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-4 py-2 pl-4">
                          <Link to="/category/rings" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Rings</Link>
                          <Link to="/category/earrings" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Earrings</Link>
                          <Link to="/category/bracelets" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Bracelets & Bangles</Link>
                          <Link to="/category/necklaces" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Pendants & Necklaces</Link>
                          <Link to="/category/sets" className="hover:text-[var(--primary)] transition-colors text-sm text-[var(--muted-foreground)]">Sets</Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

              </SheetContent>
            </Sheet>

            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-[var(--primary)] transition-colors" aria-label="Search">
              <Search size={22} strokeWidth={1} />
            </button>
          </div>

          {/* Center Logo */}
          <Link to="/" className="text-center absolute left-1/2 transform -translate-x-1/2">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest font-medium text-[var(--primary)]">
              AMEYA
            </h1>
            <span className="block text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.3em] text-[var(--foreground)] mt-0.5">
              New York
            </span>
          </Link>

          {/* Right Side: Contact, Login, Cart */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/contact" className="p-2 hover:text-[var(--primary)] transition-colors" aria-label="Contact">
              <MessageCircle size={22} strokeWidth={1} />
            </Link>
            
            {user ? <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:text-[var(--primary)] transition-colors outline-none focus:outline-none">
                  <User size={22} strokeWidth={1} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[var(--background)] border-[var(--border)] z-50">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/account">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Link to="/login" className="p-2 hover:text-[var(--primary)] transition-colors" aria-label="Login">
                <User size={22} strokeWidth={1} />
              </Link>}

            <Link to="/cart" className="p-2 hover:text-[var(--primary)] transition-colors relative" aria-label="Shopping Bag">
              <ShoppingBag size={22} strokeWidth={1} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>;
}
