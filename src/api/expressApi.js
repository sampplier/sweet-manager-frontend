const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const authProxy = require('./middleware/authProxy');

const app = express();
app.use(express.json());
app.use(authProxy);

const API_BASE = process.env.BACKEND_URL || 'http://localhost:8080/api';


app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/ingredients', require('./routes/ingredientRoutes'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`running on http://localhost:${port}`));

module.exports = app;
