const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for editorial image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/editorial/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// GET all editorial cards
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shop_the_look ORDER BY display_order ASC, created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET cards for a specific slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM shop_the_look WHERE target_slug = ? ORDER BY display_order ASC',
      [req.params.slug]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new editorial card
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { target_slug, display_order } = req.body;
    const image_url = req.file ? `/uploads/editorial/${req.file.filename}` : null;

    if (!image_url) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const [result] = await db.query(
      'INSERT INTO shop_the_look (image_url, target_slug, display_order) VALUES (?, ?, ?)',
      [image_url, target_slug, display_order || 0]
    );

    res.status(201).json({ id: result.insertId, message: 'Editorial card created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an editorial card
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM shop_the_look WHERE id = ?', [req.params.id]);
    res.json({ message: 'Editorial card deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
