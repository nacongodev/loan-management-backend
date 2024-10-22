const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

let token;
let loanId;
let paymentId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {

  });

  const user = new User({ username: 'testuser', password: 'password123', role: 'Borrower' });
  await user.save();
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const loan = new Loan({ userId: user._id, amount: 1000 });
  await loan.save();
  loanId = loan._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Payment API', () => {
  beforeEach(async () => {
    await Payment.deleteMany({});
  });

  it('should create a new payment', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        loanId,
        amount: 200
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('amount', 200);
    paymentId = res.body._id;
  });

  it('should get all payments for a loan', async () => {
    await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        loanId,
        amount: 200
      });

    const res = await request(app)
      .get(`/api/payments/${loanId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('should update a payment', async () => {
    const res = await request(app)
      .put(`/api/payments/${paymentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 300
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('amount', 300);
  });

  it('should get all payments for a specific borrower', async () => {
    await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        loanId,
        amount: 200
      });

    const res = await request(app)
      .get(`/api/payments/borrower/${token}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });
});
