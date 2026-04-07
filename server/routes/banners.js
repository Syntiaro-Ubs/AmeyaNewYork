const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for banner media uploads (images and videos)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/banners/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images and videos!"));
  }
});

// GET all banners
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banners ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET banner for a specific slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banners WHERE page_slug = ?', [req.params.slug]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST to Add or Update a banner
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { page_slug, media_type, focal_point } = req.body;
    const media_url = req.file ? `/uploads/banners/${req.file.filename}` : req.body.media_url;

    if (!media_url) {
      return res.status(400).json({ message: 'Media (Image/Video) is required' });
    }

    // Upsert logic (insert or update on duplicate key)
    const [result] = await db.query(
      `INSERT INTO banners (page_slug, media_url, media_type, focal_point) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       media_url = VALUES(media_url), 
       media_type = VALUES(media_type), 
       focal_point = VALUES(focal_point)`,
      [page_slug, media_url, media_type, focal_point || 'center 40%']
    );

    res.status(200).json({ message: 'Banner saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a banner
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
