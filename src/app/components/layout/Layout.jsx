import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AddedToBagModal } from '../AddedToBagModal';
import { ProductQuickViewSidebar } from '../ProductQuickViewSidebar';
export function Layout() {
  const {
    pathname
  } = useLocation();
  const isCheckout = pathname === '/checkout';
  return <div className="flex flex-col min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--secondary)] selection:text-white">
      {!isCheckout && <Navbar />}
      <AddedToBagModal />
      <ProductQuickViewSidebar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isCheckout && <Footer />}
      <ScrollRestoration />
    </div>;
}
