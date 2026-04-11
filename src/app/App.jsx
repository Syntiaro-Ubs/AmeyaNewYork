import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { OrderProvider } from './context/OrderContext';
import { SiteDataProvider } from './context/SiteDataContext';
export default function App() {
  return <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <SiteDataProvider>
            <QuickViewProvider>
              <OrderProvider>
                <RouterProvider router={router} />
              </OrderProvider>
            </QuickViewProvider>
          </SiteDataProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>;
}
