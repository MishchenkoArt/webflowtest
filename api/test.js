const express = require('express');
const axios = require('axios').default;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;
const COLLECTION_ID = process.env.COLL_ID;
const ZDOROVISTOSUNKY_URL = 'https://www.zdorovistosunky.org';

// Додамо CORS заголовки
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Дозволимо запити з будь-якого домену
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE'); // Дозволимо певні методи запитів
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Дозволимо певні заголовки запитів
  next();
});

// Роут для проксі запитів на сервер zdorovistosunky.org
app.post('/api/proxy-to-zdorovistosunky', async (req, res) => {
  try {
    const { email } = req.body;
    const atIndex = email.indexOf('@');
    const name = email.slice(0, atIndex);
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Виконання запиту на сервер zdorovistosunky.org
    const response = await axios.post(`${ZDOROVISTOSUNKY_URL}/users`, { email });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Прослуховуємо порт 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});