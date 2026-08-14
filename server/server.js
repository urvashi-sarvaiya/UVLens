const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const billRoutes = require('./routes/billRoutes');
app.use('/api/bills', billRoutes);

app.get('/', (req, res) => {
  res.send('UVLens backend is running 🚀');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection error ❌', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});