import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { QuickViewProvider } from './context/QuickViewContext';
export default function App() {
  return <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QuickViewProvider>
            <RouterProvider router={router} />
          </QuickViewProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>;
}
