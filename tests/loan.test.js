const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Loan = require('../models/Loan');
const ObjectId = mongoose.Types.ObjectId;
let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = new User({ username: 'testuser', password: 'password123', role: 'Borrower' });
  await user.save();
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Loan API', () => {
  beforeEach(async () => {
    await Loan.deleteMany({});
  });

  it('should create a new loan', async () => {
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 1000
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('amount', 1000);
  });

  it('should get all loans for the authenticated user', async () => {
    await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 1000
      });

    const res = await request(app)
      .get('/api/loans')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('should update a loan status', async () => {
    const loan = new Loan({ userId: new ObjectId(), amount: 1000 }); // Use 'new' keyword
    await loan.save();

    const res = await request(app)
      .put(`/api/loans/${loan._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'Approved'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'Approved');
  });

  it('should delete a loan', async () => {
    const loan = new Loan({ userId: new ObjectId(), amount: 1000 }); // Use 'new' keyword
    await loan.save();

    const res = await request(app)
      .delete(`/api/loans/${loan._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Loan deleted successfully');
  });
});
