const express = require('express');
const { createLoan, getLoans, updateLoan, deleteLoan } = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createLoan);
router.get('/', authMiddleware, getLoans);
router.put('/:loanId', authMiddleware, updateLoan);
router.delete('/:loanId', authMiddleware, deleteLoan);

module.exports = router;
