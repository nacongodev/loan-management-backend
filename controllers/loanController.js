const Loan = require('../models/Loan');

exports.createLoan = async (req, res) => {
  const { amount } = req.body;
  try {
    const loan = new Loan({ userId: req.user.id, amount });
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id });
    res.status(200).json(loans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLoan = async (req, res) => {
  const { loanId } = req.params;
  const { status } = req.body;
  try {
    const loan = await Loan.findByIdAndUpdate(loanId, { status, updatedAt: Date.now() }, { new: true });
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
    const loan = await Loan.findByIdAndDelete(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
