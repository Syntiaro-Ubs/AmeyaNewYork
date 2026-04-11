const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for homepage image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, 'hp-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// GET all categories (Dynamic)
router.get('/categories/all', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    console.error('FETCH CATEGORIES ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new category
router.get('/categories/available', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT name, slug FROM categories ORDER BY name ASC");
    res.json(rows.map(r => r.slug));
  } catch (error) {
    console.error('FETCH AVAILABLE CATEGORIES ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all collections (Dynamic)
router.get('/collections/all', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM collections ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    console.error('FETCH COLLECTIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/collections/available', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT name, slug FROM collections ORDER BY name ASC");
    res.json(rows.map(r => r.slug));
  } catch (error) {
    console.error('FETCH AVAILABLE COLLECTIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD NEW METADATA
router.post('/metadata/add', async (req, res) => {
  const { type, name, slug } = req.body;
  const table = type === 'category' ? 'categories' : 'collections';
  
  try {
    await db.query(`INSERT INTO ${table} (name, slug) VALUES (?, ?)`, [name, slug]);
    res.json({ message: `${type} added successfully` });
  } catch (error) {
    console.error(`ADD ${type} ERROR:`, error);
    res.status(500).json({ message: 'Duplicate or invalid entry' });
  }
});

router.put('/metadata/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const { name, slug, image, description, hover_image } = req.body;

  try {
    if (type === 'category') {
      await db.query(
        'UPDATE categories SET name = ?, slug = ?, image = ? WHERE id = ?',
        [name, slug, image || null, id]
      );
    } else if (type === 'collection') {
      await db.query(
        'UPDATE collections SET name = ?, slug = ?, description = ?, image = ?, hover_image = ? WHERE id = ?',
        [name, slug, description || null, image || null, hover_image || null, id]
      );
    } else {
      return res.status(400).json({ message: 'Invalid metadata type' });
    }

    res.json({ message: `${type} updated successfully` });
  } catch (error) {
    console.error(`UPDATE ${type} ERROR:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE METADATA
router.delete('/metadata/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const table = type === 'category' ? 'categories' : 'collections';
  
  try {
    await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    res.json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error(`DELETE ${type} ERROR:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all active homepage sections (Public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM homepage_sections WHERE is_visible = 1 ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all homepage sections (Admin)
router.get('/admin', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM homepage_sections ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a homepage section
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, subtitle, description, media_url, link_url, content_json, is_visible } = req.body;
    
    await db.query(
      `UPDATE homepage_sections SET 
        title = ?, subtitle = ?, description = ?, 
        media_url = ?, link_url = ?, content_json = ?, 
        is_visible = ? 
      WHERE section_slug = ?`,
      [title, subtitle, description, media_url, link_url, content_json, is_visible, slug]
    );
    
    res.json({ message: `Section ${slug} updated successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPLOAD image for homepage
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const media_url = `/uploads/${req.file.filename}`;
    res.json({ media_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
