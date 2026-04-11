# Backend API Requirements for Ameya New York

## Overview
All static data has been removed from the frontend. The application now requires a fully functional backend API to display content.

## Required API Endpoints

### 1. Categories
**Endpoint:** `GET /api/categories`

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Rings",
    "slug": "rings",
    "image": "/uploads/categories/rings.jpg",
    "hover_image": "/uploads/categories/rings-hover.jpg"
  }
]
```

### 2. Collections
**Endpoint:** `GET /api/collections`

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Éclat Initial",
    "slug": "eclat-initial",
    "description": "Personal, powerful, and precious...",
    "image": "/uploads/collections/eclat.jpg",
    "hover_image": "/uploads/collections/eclat-hover.jpg",
    "text_color": "text-white"
  }
]
```

### 3. Products
**Endpoint:** `GET /api/products`

**Response Format:**
```json
[
  {
    "id": "product-1",
    "name": "Diamond Ring",
    "price": 5200,
    "category": "rings",
    "collection": "love-engagement",
    "description": "Stunning diamond ring...",
    "material": "Platinum",
    "gemstone": "Diamond",
    "image": "/uploads/products/ring-1.jpg",
    "gallery": [
      "/uploads/products/ring-1.jpg",
      "/uploads/products/ring-1-model.jpg"
    ],
    "featured": true,
    "inStock": true
  }
]
```

### 4. Homepage Sections
**Endpoint:** `GET /api/homepage`

**Response Format:**
```json
[
  {
    "section_slug": "hero",
    "title": "Jewelry That Tells Your Story",
    "subtitle": "Timeless Elegance",
    "media_url": "/uploads/hero-banner.jpg",
    "link_url": "/category/new-arrivals",
    "is_visible": 1
  },
  {
    "section_slug": "instagram-feed",
    "title": "@AmeyaNewYork",
    "subtitle": "Follow us for daily inspiration",
    "content_json": "[{\"image\":\"/uploads/insta1.jpg\"},{\"image\":\"/uploads/insta2.jpg\"}]",
    "is_visible": 1
  }
]
```

### 5. Category/Collection Banners
**Endpoint:** `GET /api/banners/:slug`

**Response Format:**
```json
{
  "media_url": "/uploads/banners/rings-banner.mp4",
  "media_type": "video",
  "focal_point": "center"
}
```

For images:
```json
{
  "media_url": "/uploads/banners/rings-banner.jpg",
  "media_type": "image",
  "focal_point": "center 40%"
}
```

### 6. Editorial Images (Shop the Look)
**Endpoint:** `GET /api/editorial/:slug`

**Response Format:**
```json
[
  {
    "image_url": "/uploads/editorial/look1.jpg",
    "collection_label": "Éclat Initial",
    "link_url": "/category/eclat-initial"
  }
]
```

## Image URL Format

The frontend uses the `getImageUrl()` helper function which handles these formats:

1. **Relative paths starting with `/uploads/`:**
   - Input: `/uploads/banner.jpg`
   - Output: `http://localhost:5000/uploads/banner.jpg`

2. **Full URLs:**
   - Input: `http://localhost:5000/uploads/banner.jpg`
   - Output: Same (no change)

3. **External URLs:**
   - Input: `https://example.com/image.jpg`
   - Output: Same (no change)

## Database Schema Requirements

### Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image VARCHAR(255),
  hover_image VARCHAR(255)
);
```

### Collections Table
```sql
CREATE TABLE collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  hover_image VARCHAR(255),
  text_color VARCHAR(50) DEFAULT 'text-white'
);
```

### Products Table
```sql
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(255),
  collection VARCHAR(255),
  description TEXT,
  material VARCHAR(255),
  gemstone VARCHAR(255),
  image VARCHAR(255),
  gallery JSON,
  featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE
);
```

### Homepage Sections Table
```sql
CREATE TABLE homepage_sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  media_url VARCHAR(255),
  link_url VARCHAR(255),
  content_json TEXT,
  is_visible TINYINT(1) DEFAULT 1
);
```

### Banners Table
```sql
CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  media_url VARCHAR(255) NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  focal_point VARCHAR(50) DEFAULT 'center'
);
```

## Important Notes

1. **All image/video paths must start with `/uploads/`** for the frontend to construct proper URLs
2. **The `gallery` field in products** should be a JSON array of image paths
3. **The `content_json` field** in homepage_sections should be a JSON string
4. **Video files** are detected by file extension (.mp4, .webm, .ogg, .mov)
5. **The frontend will show a dark gradient** if no banner is uploaded for a category/collection

## Testing Checklist

- [ ] Categories API returns all categories with images
- [ ] Collections API returns all collections with images
- [ ] Products API returns products with gallery arrays
- [ ] Homepage API returns hero section with media_url
- [ ] Homepage API returns instagram-feed section with content_json
- [ ] Banners API returns banner for each category/collection slug
- [ ] All image URLs start with `/uploads/`
- [ ] File uploads save to `/uploads/` directory
- [ ] Static file serving is configured for `/uploads/` path
