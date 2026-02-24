const express = require('express')
const router = express.Router()
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))
const API_BASE = process.env.BACKEND_URL || 'http://localhost:8080/api'

router.get('/', async (req, res) => {
  const resp = await fetch(`${API_BASE}/products`, {
    headers: {
      Authorization: req.headers.authorization
    }
  })

  const data = await resp.json()
  res.status(resp.status).json(data)
})

router.post('/', async (req, res) => {
  const resp = await fetch(`${API_BASE}/products`, {
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

router.delete('/:id', async (req, res) => {
  const resp = await fetch(`${API_BASE}/products/${req.params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: req.headers.authorization
    }
  })

  res.sendStatus(resp.status)
})

module.exports = router
