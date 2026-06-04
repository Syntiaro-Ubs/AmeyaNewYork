const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Multi-field upload configuration
const productUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('FETCH ALL PRODUCTS ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a single product (Support both numeric ID and alphanumeric product_id)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Check both columns: numeric primary key 'id' OR alphanumeric 'product_id'
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ? OR product_id = ?', 
      [id, id]
    );
    
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('FETCH PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new product
router.post('/', productUpload, async (req, res) => {
  try {
    const { 
      name, price, category, collection, description, 
      material, gemstone, featured, in_stock, product_id, 
      stock_quantity, care_instructions, shipping_returns, size_guide, sizes, size_stock
    } = req.body;

    // Check if product_id already exists
    if (product_id) {
      const [existing] = await db.query('SELECT id FROM products WHERE product_id = ?', [product_id]);
      if (existing.length > 0) {
        return res.status(400).json({ message: `Product ID '${product_id}' is already in use. Please use a unique Product ID.` });
      }
    }

    // Handle main image
    const image = (req.files && req.files['image']) ? `/uploads/${req.files['image'][0].filename}` : req.body.image;
    
    // Handle gallery images
    let gallery = [];
    if (req.files && req.files['gallery']) {
      gallery = req.files['gallery'].map(file => `/uploads/${file.filename}`);
    } else if (req.body.gallery) {
      gallery = typeof req.body.gallery === 'string' ? JSON.parse(req.body.gallery) : req.body.gallery;
    }

    const [result] = await db.query(
      `INSERT INTO products (
        product_id, name, price, category, collection, description, 
        material, gemstone, image, gallery, featured, in_stock, 
        stock_quantity, care_instructions, shipping_returns, size_guide, sizes, size_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id, name, price, category, collection, description, 
        material, gemstone, image, JSON.stringify(gallery), 
        featured === 'true', in_stock === 'true', stock_quantity || 0,
        care_instructions, shipping_returns, size_guide, sizes,
        typeof size_stock === 'object' ? JSON.stringify(size_stock) : (size_stock || null)
      ]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (error) {
    console.error('ADD PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT (update) a product
router.put('/:id', productUpload, async (req, res) => {
  try {
    const { 
      name, price, category, collection, description, 
      material, gemstone, featured, in_stock, product_id, 
      stock_quantity, care_instructions, shipping_returns, size_guide, sizes, size_stock
    } = req.body;

    // Check if product_id is already in use by another product
    if (product_id) {
      const [existing] = await db.query('SELECT id FROM products WHERE product_id = ? AND id != ?', [product_id, req.params.id]);
      if (existing.length > 0) {
        return res.status(400).json({ message: `Product ID '${product_id}' is already in use by another product. Please use a unique Product ID.` });
      }
    }

    // Handle main image update
    let image = req.body.image;
    if (req.files && req.files['image']) {
      image = `/uploads/${req.files['image'][0].filename}`;
    }

    // Handle gallery update
    let gallery = [];
    if (req.body.existing_gallery !== undefined) {
      gallery = typeof req.body.existing_gallery === 'string' 
        ? JSON.parse(req.body.existing_gallery) 
        : req.body.existing_gallery;
    } else if (req.body.gallery !== undefined) {
      gallery = typeof req.body.gallery === 'string' 
        ? JSON.parse(req.body.gallery) 
        : req.body.gallery;
    }

    if (req.files && req.files['gallery']) {
      const newFiles = req.files['gallery'].map(file => `/uploads/${file.filename}`);
      gallery = [...gallery, ...newFiles];
    }

    await db.query(
      `UPDATE products SET 
        product_id = ?, name = ?, price = ?, category = ?, collection = ?, 
        description = ?, material = ?, gemstone = ?, image = ?, gallery = ?, 
        featured = ?, in_stock = ?, stock_quantity = ?, 
        care_instructions = ?, shipping_returns = ?, size_guide = ?, sizes = ?, size_stock = ?
      WHERE id = ?`,
      [
        product_id, name, price, category, collection, 
        description, material, gemstone, image, JSON.stringify(gallery), 
        featured === 'true', in_stock === 'true', stock_quantity || 0,
        care_instructions, shipping_returns, size_guide, sizes,
        typeof size_stock === 'object' ? JSON.stringify(size_stock) : (size_stock || null),
        req.params.id
      ]
    );

    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products/decrement-stock
router.post('/decrement-stock', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    for (const item of items) {
      const { productId, quantity, size } = item;
      if (!productId || !quantity) continue;

      // Fetch product by id or product_id
      const [products] = await db.query(
        'SELECT id, category, sizes, size_stock, stock_quantity FROM products WHERE id = ? OR product_id = ?',
        [productId, productId]
      );
      if (products.length === 0) continue;

      const product = products[0];
      const prodId = product.id;
      const category = product.category?.toLowerCase();

      if ((category === 'bracelets' || category === 'rings') && size) {
        let sizeStock = {};
        if (product.size_stock) {
          try {
            sizeStock = typeof product.size_stock === 'string' ? JSON.parse(product.size_stock) : product.size_stock;
          } catch (e) {
            console.error('Error parsing size_stock:', e);
          }
        }

        const sizeKey = size.trim();
        if (sizeStock[sizeKey] !== undefined) {
          sizeStock[sizeKey] = Math.max(0, Number(sizeStock[sizeKey]) - Number(quantity));
        } else {
          // Fallback check: find case-insensitive matching key in sizeStock
          const matchingKey = Object.keys(sizeStock).find(k => k.toLowerCase() === sizeKey.toLowerCase());
          if (matchingKey) {
            sizeStock[matchingKey] = Math.max(0, Number(sizeStock[matchingKey]) - Number(quantity));
          } else {
            sizeStock[sizeKey] = 0;
          }
        }

        const newTotalStock = Object.values(sizeStock).reduce((sum, val) => sum + Number(val), 0);
        const inStock = newTotalStock > 0;

        await db.query(
          'UPDATE products SET size_stock = ?, stock_quantity = ?, in_stock = ? WHERE id = ?',
          [JSON.stringify(sizeStock), newTotalStock, inStock ? 1 : 0, prodId]
        );
      } else {
        const newStock = Math.max(0, Number(product.stock_quantity) - Number(quantity));
        const inStock = newStock > 0;

        await db.query(
          'UPDATE products SET stock_quantity = ?, in_stock = ? WHERE id = ?',
          [newStock, inStock ? 1 : 0, prodId]
        );
      }
    }

    res.json({ success: true, message: 'Stock decremented successfully' });
  } catch (error) {
    console.error('DECREMENT STOCK ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
