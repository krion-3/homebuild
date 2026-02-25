const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const propertyRoutes = require('./routes/property.routes');
const milestoneRoutes = require('./routes/milestone.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Homebuild API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Homebuild server running on port ${PORT}`);
});

module.exports = app;