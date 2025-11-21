require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const voteRoutes = require('./routes/votes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://digisolvotingsytem.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/api', voteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Voting System API is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});