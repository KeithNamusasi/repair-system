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

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
