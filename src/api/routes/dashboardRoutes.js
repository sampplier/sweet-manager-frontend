const express = require('express')
const router = express.Router()
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))
const API_BASE = process.env.BACKEND_URL || 'http://localhost:8080/api'

router.get('/count', async (req, res) => {
  const resp = await fetch(`${API_BASE}/dashboard/count`, {
    headers: {
      Authorization: req.headers.authorization
    }
  })

  const data = await resp.json()
  res.status(resp.status).json(data)
})

module.exports = router
