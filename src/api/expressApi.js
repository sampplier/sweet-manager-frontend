// simple Express server used as a local proxy for dev and small route wrappers
const express = require('express')
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))
const app = express()
app.use(express.json())


const API_BASE = process.env.BACKEND_URL || 'http://localhost:8080/api'


// mount routes
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))


const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Express proxy running on http://localhost:${port}`))


module.exports = app