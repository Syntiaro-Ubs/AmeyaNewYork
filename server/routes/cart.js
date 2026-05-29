const express = require('express');
const router = express.Router();
const db = require('../db');

// GET cart items for a user
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await db.query(
      'SELECT id, product_id as productId, quantity, size FROM cart_items WHERE user_email = ?',
      [email]
    );
    res.json(rows);
  } catch (error) {
    console.error('FETCH CART ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST to add or update cart item
router.post('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { productId, quantity, size } = req.body;

    // Use INSERT ... ON DUPLICATE KEY UPDATE since we have a UNIQUE KEY on (user_email, product_id, size)
    const [result] = await db.query(
      `INSERT INTO cart_items (user_email, product_id, quantity, size) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [email, productId, quantity, size || '', quantity]
    );

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('UPDATE CART ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to update exact quantity of a cart item
router.put('/:email/:productId', async (req, res) => {
  try {
    const { email, productId } = req.params;
    const { quantity, size } = req.body;

    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE user_email = ? AND product_id = ? AND size = ?',
      [quantity, email, productId, size || '']
    );

    res.status(200).json({ message: 'Quantity updated' });
  } catch (error) {
    console.error('UPDATE QUANTITY ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a specific cart item
router.delete('/:email/:productId', async (req, res) => {
  try {
    const { email, productId } = req.params;
    const { size } = req.query; // Size passed as query parameter
    
    await db.query(
      'DELETE FROM cart_items WHERE user_email = ? AND product_id = ? AND size = ?',
      [email, productId, size || '']
    );

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('REMOVE CART ITEM ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE all cart items (Clear cart)
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await db.query('DELETE FROM cart_items WHERE user_email = ?', [email]);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('CLEAR CART ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
