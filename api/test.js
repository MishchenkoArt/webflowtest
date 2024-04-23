const axios = require('axios').default;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;
const COLLECTION_ID = process.env.COLL_ID;

// Додамо CORS заголовки
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Дозволимо запити з будь-якого домену
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE'); // Дозволимо певні методи запитів
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Дозволимо певні заголовки запитів
  next();
});

const handler = async (req, res) => {
  try {
    const { email } = req.body;
    const atIndex = email.indexOf('@');
    const name = email.slice(0, atIndex);
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Перевірка чи існує вже електронна адреса в колекції Webflow
    const existingEmailResponse = await axios.get(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Перевірка, чи електронна адреса вже існує в колекції
    const existingEmail = existingEmailResponse.data.items.some(item => item.fieldData.email === email);
    
    if (existingEmail) {
      // Якщо електронна адреса вже існує, перенаправляємо користувача
      return res.redirect(`https://www.zdorovistosunky.org/users/${name}`);
    }

    // Якщо електронної адреси ще не існує, виконуємо POST запит для додавання нового запису
    const response = await axios.post(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/live`, 
      {
        "fieldData": {
          "email": email,
          "slug": name,
          "name": name,
          "_archived": false,
          "_draft": false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

    const item_id = response.data.id;
    
    // Оновлюємо запис з ідентифікатором item_id
    await axios.patch(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/${item_id}/live`, 
      {
        "fieldData": {
          "id-field": item_id,
        }
      }, 
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

    res.status(200).json(item_id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

app.post('/api/test', handler);

// Прослуховуємо порт 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});