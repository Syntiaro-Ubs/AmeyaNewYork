const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// LOGIN Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT id, name, email, password, role, permissions FROM users WHERE email = ? AND role = ?', [email, 'admin']);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or access denied' });
    }

    const admin = rows[0];
    const isMatched = await bcrypt.compare(password, admin.password);
    
    if (!isMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user: { 
        id: admin.id, 
        name: admin.name, 
        email: admin.email, 
        role: admin.role,
        permissions: JSON.parse(admin.permissions || '[]')
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// FORGOT PASSWORD Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      // Don't reveal user existence for security, but we do for admin
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [token, expiry, email]
    );

    await sendResetEmail(email, token);
    
    res.json({ message: 'Recovery email sent. Please check your inbox.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not send recovery email' });
  }
});

// RESET PASSWORD Route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL ADMIN USERS
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, permissions, created_at FROM users WHERE role = ? ORDER BY created_at DESC', ['admin']);
    res.json(rows.map(u => ({ ...u, permissions: JSON.parse(u.permissions || '[]') })));
  } catch (error) {
    console.error('FETCH USERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// REGISTER NEW ADMIN
router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin', JSON.stringify(permissions || [])]
    );

    res.json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('REGISTER ADMIN ERROR:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// DELETE ADMIN USER
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent self-deletion if needed (optional, depends on frontend logic)
    await db.query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'admin']);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE ADMIN USER
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, permissions } = req.body;

    // 1. Check if email is already taken by another user
    const [existing] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Another user already exists with this email' });
    }

    let query = 'UPDATE users SET name = ?, email = ?, permissions = ?';
    let params = [name, email, JSON.stringify(permissions || [])];

    // 2. Handle optional password update
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ? AND role = ?';
    params.push(id, 'admin');

    await db.query(query, params);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({ message: 'Server error during update' });
  }
});

module.exports = router;
