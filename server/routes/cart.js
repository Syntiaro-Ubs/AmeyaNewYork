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

    // Fetch product details to check stock
    const [products] = await db.query(
      'SELECT category, sizes, size_stock, stock_quantity FROM products WHERE id = ? OR product_id = ?',
      [productId, productId]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    const cat = product.category?.toLowerCase();
    
    // Check stock limit
    let limit = product.stock_quantity !== undefined ? Number(product.stock_quantity) : Infinity;
    if ((cat === 'bracelets' || cat === 'rings') && size) {
      if (product.size_stock) {
        try {
          const sizeStock = typeof product.size_stock === 'string' ? JSON.parse(product.size_stock) : product.size_stock;
          const szKey = size.trim();
          const matchingKey = Object.keys(sizeStock).find(k => k.toLowerCase() === szKey.toLowerCase());
          if (matchingKey !== undefined) {
            limit = Number(sizeStock[matchingKey]);
          } else {
            limit = 0;
          }
        } catch (e) {
          console.error('Error parsing size_stock:', e);
          limit = 0;
        }
      } else {
        limit = 0;
      }
    }

    // Get current quantity in cart for this item
    const [cartRows] = await db.query(
      'SELECT quantity FROM cart_items WHERE user_email = ? AND product_id = ? AND size = ?',
      [email, productId, size || '']
    );
    const currentQty = cartRows.length > 0 ? Number(cartRows[0].quantity) : 0;

    if (currentQty + quantity > limit) {
      return res.status(400).json({ 
        message: `Only ${limit} pieces are available in size ${size}. You already have ${currentQty} in your cart.` 
      });
    }

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

    // Fetch product details to check stock
    const [products] = await db.query(
      'SELECT category, sizes, size_stock, stock_quantity FROM products WHERE id = ? OR product_id = ?',
      [productId, productId]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    const cat = product.category?.toLowerCase();
    
    // Check stock limit
    let limit = product.stock_quantity !== undefined ? Number(product.stock_quantity) : Infinity;
    if ((cat === 'bracelets' || cat === 'rings') && size) {
      if (product.size_stock) {
        try {
          const sizeStock = typeof product.size_stock === 'string' ? JSON.parse(product.size_stock) : product.size_stock;
          const szKey = size.trim();
          const matchingKey = Object.keys(sizeStock).find(k => k.toLowerCase() === szKey.toLowerCase());
          if (matchingKey !== undefined) {
            limit = Number(sizeStock[matchingKey]);
          } else {
            limit = 0;
          }
        } catch (e) {
          console.error('Error parsing size_stock:', e);
          limit = 0;
        }
      } else {
        limit = 0;
      }
    }

    if (quantity > limit) {
      return res.status(400).json({ 
        message: `Only ${limit} pieces are available in size ${size || 'N/A'}.` 
      });
    }

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
