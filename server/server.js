const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Purchase = require('./models/Purchase');
const Repair = require('./models/Repair');
const Saving = require('./models/Saving');

const app = express();

// CORS configuration - allow all for now
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Middleware
app.use(express.json());

// Connect to database and sync
const startServer = async () => {
  try {
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    
    console.log('Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/repairs', require('./routes/repairs'));
app.use('/api/savings', require('./routes/savings'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Electronics Repair POS API' });
});

startServer();

module.exports = app;
