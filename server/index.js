const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ override: true });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const editorialRoutes = require('./routes/editorial');
const bannerRoutes = require('./routes/banners');
const homepageRoutes = require('./routes/homepage');
const journalRoutes = require('./routes/journal');
const cartRoutes = require('./routes/cart');
const trackingRoutes = require('./routes/tracking');
const paymentRoutes = require('./routes/payment');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/editorial', editorialRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payment', paymentRoutes);



// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Nodemon reload trigger

