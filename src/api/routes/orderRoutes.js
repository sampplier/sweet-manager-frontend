const express = require('express')
const router = express.Router()
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))
const API_BASE = process.env.BACKEND_URL || 'http://localhost:8080/api'

// GET orders
router.get('/', async (req, res) => {
  const resp = await fetch(`${API_BASE}/orders`, {
    headers: {
      Authorization: req.headers.authorization
    }
  })

  const data = await resp.json()
  res.status(resp.status).json(data)
})

// CREATE order
router.post('/', async (req, res) => {
  const resp = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.headers.authorization
    },
    body: JSON.stringify(req.body)
  })

  const data = await resp.json()
  res.status(resp.status).json(data)
})

module.exports = router
