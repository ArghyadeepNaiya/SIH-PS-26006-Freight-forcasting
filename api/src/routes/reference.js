const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/ports', async (req, res) => {
  const db = mongoose.connection.db;
  const ports = await db.collection('ports').find({}).toArray();
  res.json(ports);
});

router.get('/vessels', async (req, res) => {
  const db = mongoose.connection.db;
  const vessels = await db.collection('vessel_classes').find({}).toArray();
  res.json(vessels);
});

module.exports = router;
