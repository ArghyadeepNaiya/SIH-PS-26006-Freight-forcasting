require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/freight_decision_system',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000'
};
