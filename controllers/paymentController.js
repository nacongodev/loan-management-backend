const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

exports.createPayment = async (req, res) => {
  const { loanId, amount } = req.body;
  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    const payment = new Payment({ loanId, amount });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  const { loanId } = req.params;
  try {
    const payments = await Payment.find({ loanId });
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
