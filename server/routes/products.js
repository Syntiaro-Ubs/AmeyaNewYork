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
    cb(null, Date.now() + path.extname(file.originalname))
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
      stock_quantity, care_instructions, shipping_returns, size_guide 
    } = req.body;

    // Handle main image
    const image = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : req.body.image;
    
    // Handle gallery images
    let gallery = [];
    if (req.files['gallery']) {
      gallery = req.files['gallery'].map(file => `/uploads/${file.filename}`);
    } else if (req.body.gallery) {
      gallery = typeof req.body.gallery === 'string' ? JSON.parse(req.body.gallery) : req.body.gallery;
    }

    const [result] = await db.query(
      `INSERT INTO products (
        product_id, name, price, category, collection, description, 
        material, gemstone, image, gallery, featured, in_stock, 
        stock_quantity, care_instructions, shipping_returns, size_guide
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id, name, price, category, collection, description, 
        material, gemstone, image, JSON.stringify(gallery), 
        featured === 'true', in_stock === 'true', stock_quantity || 0,
        care_instructions, shipping_returns, size_guide
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
      stock_quantity, care_instructions, shipping_returns, size_guide 
    } = req.body;

    // Handle main image update
    let image = req.body.image;
    if (req.files['image']) {
      image = `/uploads/${req.files['image'][0].filename}`;
    }

    // Handle gallery update
    let gallery = [];
    if (req.files['gallery']) {
      gallery = req.files['gallery'].map(file => `/uploads/${file.filename}`);
    } else if (req.body.gallery) {
      gallery = typeof req.body.gallery === 'string' ? JSON.parse(req.body.gallery) : req.body.gallery;
    }

    await db.query(
      `UPDATE products SET 
        product_id = ?, name = ?, price = ?, category = ?, collection = ?, 
        description = ?, material = ?, gemstone = ?, image = ?, gallery = ?, 
        featured = ?, in_stock = ?, stock_quantity = ?, 
        care_instructions = ?, shipping_returns = ?, size_guide = ? 
      WHERE id = ?`,
      [
        product_id, name, price, category, collection, 
        description, material, gemstone, image, JSON.stringify(gallery), 
        featured === 'true', in_stock === 'true', stock_quantity || 0,
        care_instructions, shipping_returns, size_guide,
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

module.exports = router;
