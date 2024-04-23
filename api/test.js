const express = require('express');
const axios = require('axios').default;

const app = express();
const API_KEY = process.env.API_KEY;
const COLLECTION_ID = process.env.COLL_ID;

// Middleware для обробки CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Разрешить доступ з усіх джерел
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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

    const existingEmailResponse = await axios.get(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const existingEmail = existingEmailResponse.data.items.some(item => item.fieldData.email === email);
    console.log(existingEmail)
    if (existingEmail) {
      console.log("yes")
      return res.redirect(`https://www.zdorovistosunky.org/users/tema213132`);
    }

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

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});