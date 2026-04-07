const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/editorial', editorialRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/homepage', homepageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
