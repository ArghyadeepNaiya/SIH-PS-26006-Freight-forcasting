const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
  cargo_type: String,
  quantity_tonnes: Number,
  origin: String,
  earliest_arrival: String,
  latest_arrival: String,
  destination_plant: String,
  destination_port: String,
  overrides: Object,
  recommendation_response: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
