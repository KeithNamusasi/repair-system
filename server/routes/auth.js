const express = require('express');
const { login, register, createAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/create-admin', createAdmin);

module.exports = router;