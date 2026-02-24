const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const API_BASE = process.env.BACKEND_URL || 'http://localhost:8080/api';

// GET all ingredients
router.get('/', async (req, res) => {
  const resp = await fetch(`${API_BASE}/ingredients`, {
    headers: req.headersForBackend,
  });
  const data = await resp.json();
  res.status(resp.status).json(data);
});

// POST new ingredient
router.post('/', async (req, res) => {
  const resp = await fetch(`${API_BASE}/ingredients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...req.headersForBackend,
    },
    body: JSON.stringify(req.body),
  });
  const data = await resp.json();
  res.status(resp.status).json(data);
});

// DELETE ingredient
router.delete('/:id', async (req, res) => {
  const resp = await fetch(`${API_BASE}/ingredients/${req.params.id}`, {
    method: 'DELETE',
    headers: req.headersForBackend,
  });
  res.sendStatus(resp.status);
});

module.exports = router;
