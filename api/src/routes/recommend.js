const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');
const Scenario = require('../models/Scenario');

router.post('/', async (req, res) => {
  try {
    const mlResponse = await axios.post(`${config.ML_SERVICE_URL}/ml/recommend`, req.body);
    
    // Save scenario asynchronously
    const scenario = new Scenario({
      ...req.body,
      recommendation_response: mlResponse.data
    });
    scenario.save().catch(err => console.error("Error saving scenario:", err));
    
    res.json(mlResponse.data);
  } catch (error) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendation" });
  }
});

module.exports = router;
