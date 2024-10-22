const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createPayment);
router.get('/:loanId', authMiddleware, getPayments);

module.exports = router;
