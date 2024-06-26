const axios = require('axios').default;
const express = require('express');
const cors = require('cors');

const API_KEY = process.env.API_KEY;
const COLLECTION_ID = process.env.COLL_ID;

const app = express();

// Додаємо middleware CORS
app.use(cors());
// Додаємо middleware для парсингу JSON-даних з тіла запиту
app.use(express.json());

// Обробник запиту
const handler = async (req, res) => {
  try {
    const { Email } = req.body;

    if (!Email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const atIndex = Email.indexOf('@');
    const name = Email.slice(0, atIndex);

    // Перевірка чи існує вже електронна адреса в колекції Webflow
    const existingEmailResponse = await axios.get(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Перевірка, чи електронна адреса вже існує в колекції
    const existingEmailItem = existingEmailResponse.data.items.find(item => item.fieldData.email === Email);
    if (existingEmailItem) {
      console.log("yes ", existingEmailItem.fieldData.slug);
      return res.status(200).json(existingEmailItem.fieldData.slug);
    } else {
      console.log("no");
      // Якщо електронної адреси ще не існує, виконати POST запит для додавання нового запису
      const response = await axios.post(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/live`, {
        "fieldData": {
          "email": Email,
          "name": name,
          "_archived": false,
          "_draft": false
        }
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const item_id = response.data.id;
      const slug = response.data.fieldData.slug;

      await axios.patch(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/${item_id}/live`, {
        "fieldData": {
          "id-field": item_id,
        }
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json(slug);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Налаштуємо маршрут для обробника
app.post('/api/test', handler);

module.exports = app;