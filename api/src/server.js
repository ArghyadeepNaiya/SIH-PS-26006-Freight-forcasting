const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api', require('./routes/reference'));

app.listen(config.PORT, () => {
  console.log(`API Gateway listening on port ${config.PORT}`);
});
