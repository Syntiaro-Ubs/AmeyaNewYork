import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { NewArrival } from "./pages/NewArrival";
import { ProductDetails } from "./pages/ProductDetails";
import { Category } from "./pages/Category";
import { Login } from "./pages/Login";
import { Account } from "./pages/Account";
import { Orders } from "./pages/Orders";
import { Contact } from "./pages/Contact";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { DashboardLogin } from "./pages/Dashboard/DashboardLogin";

// Protected Route Component for Admin Dashboard
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/dashboard/login';
    return null;
  }
  return children;
};

export const router = createBrowserRouter([{
  path: "/dashboard",
  Component: () => (
    <AdminProtectedRoute>
      <Dashboard />
    </AdminProtectedRoute>
  )
}, {
  path: "/dashboard/login",
  Component: DashboardLogin
}, {
  path: "/",
  Component: Layout,
  children: [{
    index: true,
    Component: Home
  }, {
    path: "new-arrival",
    Component: NewArrival
  }, {
    path: "login",
    Component: Login
  }, {
    path: "account",
    Component: Account
  }, {
    path: "orders",
    Component: Orders
  }, {
    path: "contact",
    Component: Contact
  }, {
    path: "cart",
    Component: Cart
  }, {
    path: "checkout",
    Component: Checkout
  }, {
    path: "product/:id",
    Component: ProductDetails
  }, {
    path: "category/:slug",
    Component: Category
  }, {
    path: "collection/:slug",
    // Reuse Category component logic for now, or create a Collection wrapper
    Component: Category
  }, {
    path: "*",
    Component: () => <div className="p-20 text-center">Page Not Found</div>
  }]
}]);
