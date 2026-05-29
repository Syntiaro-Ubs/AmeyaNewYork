const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for journal image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, 'journal-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images! Valid formats: JPG, PNG, GIF, WEBP."));
  }
});

// GET all journal articles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM journal_articles ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET specific article by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM journal_articles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new article
router.post('/', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const { title, excerpt, content, category, read_time, is_featured } = req.body;
      const image_url = req.file ? `/uploads/${req.file.filename}` : null;
      const featured = is_featured === 'true' || is_featured === true || is_featured === 1;

      // If this is set as featured, we might want to unset others (optional logic, skipping for simplicity unless requested)

      const [result] = await db.query(
        `INSERT INTO journal_articles (title, excerpt, content, image_url, category, read_time, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, excerpt, content, image_url, category, read_time, featured]
      );

      res.status(201).json({ message: 'Article created successfully', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// PUT update article
router.put('/:id', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const { id } = req.params;
      const { title, excerpt, content, category, read_time, is_featured } = req.body;
      const featured = is_featured === 'true' || is_featured === true || is_featured === 1;

      let updateQuery = `UPDATE journal_articles SET 
        title = ?, excerpt = ?, content = ?, category = ?, read_time = ?, is_featured = ?`;
      let queryParams = [title, excerpt, content, category, read_time, featured];

      if (req.file) {
        updateQuery += `, image_url = ?`;
        queryParams.push(`/uploads/${req.file.filename}`);
      }

      updateQuery += ` WHERE id = ?`;
      queryParams.push(id);

      await db.query(updateQuery, queryParams);

      res.json({ message: 'Article updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// DELETE article
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM journal_articles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
