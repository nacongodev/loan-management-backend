const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const limiter = require('./middleware/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerConfig');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
