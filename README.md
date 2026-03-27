# AMEYA New York - Jewelry E-commerce Frontend

## Overview
This is the complete frontend implementation for AMEYA New York jewelry e-commerce website. Built with React + Vite, featuring a modern, responsive design with smooth animations and interactive elements.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git LFS (for large image files)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Ameya

# Install Git LFS (if not already installed)
git lfs install

# Pull LFS files (images and videos)
git lfs pull

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
Ameya/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/           # Home page sections
│   │   │   ├── layout/         # Header, Footer, Navigation
│   │   │   └── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Category.jsx    # Category/Collection pages
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Account.jsx
│   │   ├── context/            # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── data.js             # ⚠️ SAMPLE DATA (Replace with API)
│   │   └── routes.jsx
│   ├── assets/                 # Images and videos (Git LFS)
│   │   └── collection/
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 🎨 Features Implemented

### Pages
- ✅ Home page with hero, collections, categories
- ✅ Category pages (Rings, Earrings, Necklaces, Bracelets, Sets)
- ✅ Collection pages (Apex Spark, Éclat Initial, Elevé, Love & Engagement)
- ✅ Product detail page with image gallery
- ✅ Shopping cart
- ✅ Checkout flow
- ✅ Login/Signup
- ✅ User account page
- ✅ Contact page

### Functionality
- ✅ Product filtering by category/collection
- ✅ Product sorting (price, newest)
- ✅ Add to cart
- ✅ Wishlist
- ✅ Quick view sidebar
- ✅ Image hover effects (jewelry → model)
- ✅ Video hero sections
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations (Framer Motion)
- ✅ Toast notifications

## 🔌 Backend Integration Required

### Current State
The app currently uses **mock data** from `src/app/data.js` for demonstration purposes.

### What Backend Team Needs to Build

#### 1. API Endpoints

```javascript
// Products
GET    /api/products              // Get all products
GET    /api/products/:id          // Get single product
GET    /api/products?category=rings  // Filter by category
GET    /api/products?collection=apex-spark  // Filter by collection
POST   /api/products              // Create product (admin)
PUT    /api/products/:id          // Update product (admin)
DELETE /api/products/:id          // Delete product (admin)

// Collections
GET    /api/collections           // Get all collections

// Categories  
GET    /api/categories            // Get all categories

// Cart (if server-side)
POST   /api/cart                  // Add to cart
GET    /api/cart                  // Get cart items
DELETE /api/cart/:id              // Remove from cart

// Orders
POST   /api/orders                // Create order
GET    /api/orders                // Get user orders
GET    /api/orders/:id            // Get order details

// Auth
POST   /api/auth/register         // User registration
POST   /api/auth/login            // User login
POST   /api/auth/logout           // User logout
GET    /api/auth/me               // Get current user
```

#### 2. Product Data Structure

See `src/app/data.js` for the exact structure. Each product should have:

```javascript
{
  id: string,
  name: string,
  price: number,
  category: string,              // "Rings", "Earrings", "Necklaces & Pendants", etc.
  collection: string,            // "apex-spark", "eclat-initial", "eleve", "love-engagement"
  material: string,              // "18k gold, diamonds"
  image: string,                 // Main product image URL
  gallery: string[],             // Array of image URLs [jewelry_image, model_image]
  description: string,
  isBestSeller: boolean,
  isNew: boolean
}
```

#### 3. Collection Data Structure

```javascript
{
  id: string,
  name: string,
  slug: string,                  // "apex-spark"
  description: string,
  image: string,                 // Collection banner image URL
  hoverImage: string,            // Model image URL
  textColor: string              // "text-white" or "text-black"
}
```

#### 4. Category Data Structure

```javascript
{
  id: string,
  name: string,
  slug: string,                  // "rings"
  image: string,                 // Category image URL
  hoverImage: string             // Model image URL
}
```

### Integration Steps

1. **Create API service layer:**
   ```javascript
   // src/services/api.js
   const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
   
   export const fetchProducts = async (filters = {}) => {
     const params = new URLSearchParams(filters);
     const response = await fetch(`${API_BASE_URL}/products?${params}`);
     return response.json();
   };
   ```

2. **Replace data.js imports:**
   ```javascript
   // Before:
   import { products } from '../data';
   
   // After:
   import { fetchProducts } from '../services/api';
   const [products, setProducts] = useState([]);
   useEffect(() => {
     fetchProducts().then(setProducts);
   }, []);
   ```

3. **Add environment variables:**
   ```bash
   # .env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Handle loading and error states**

## 🖼️ Image Storage

Current images are stored in `src/assets/collection/` (tracked with Git LFS).

For production, backend should:
- Use cloud storage (AWS S3, Cloudinary, etc.)
- Return image URLs in API responses
- Handle image uploads through admin panel

## 📦 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📝 Notes for Backend Team

1. **Authentication**: Currently uses mock auth in `AuthContext.jsx`. Replace with real JWT/session-based auth.

2. **Cart**: Currently stored in React Context (client-side). Consider server-side cart for logged-in users.

3. **Image URLs**: Update all image imports to use URLs from your API/CDN.

4. **Payment**: Checkout UI is ready. Integrate with Stripe/PayPal/etc.

5. **Admin Panel**: No admin UI included. Backend team should build admin dashboard.

6. **Search**: Search UI exists but needs backend search API.

## 🔗 Important Files to Review

- `src/app/data.js` - Sample data structure (your API should match this)
- `src/app/context/` - State management (cart, auth, wishlist)
- `src/app/pages/Category.jsx` - Main product listing logic
- `src/app/pages/ProductDetails.jsx` - Product detail page

## 📞 Questions?

Contact the frontend developer for any clarifications about the implementation.

---

**Note:** This is a frontend-only implementation. Backend API integration is required for production use.
