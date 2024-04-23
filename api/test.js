const axios = require('axios').default;

const API_KEY = process.env.API_KEY;
const COLLECTION_ID = process.env.COLL_ID;

const handler = async (req, res) => {
  try {
    // Отримання даних з тіла запиту, які містяться в полі email
    const { email } = req.body;
    // Перевірка чи є електронна пошта у тілі запиту
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Вивід електронної пошти в консоль
    console.log('Received email:', email);
    console.log (COLLECTION_ID, + " "+ API_KEY)

    // Виконання POST запиту на test.com з використанням axios та тілом запиту
    const response = await axios.post(`https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/live`, 
    {
      "email": email,
      "fieldData": {
          "slug": "gred",
          "name": "gred",
          "_archived": false,
          "_draft": false
      }
  }, 
    {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // Відправлення відповіді клієнту
    res.status(200).json(response.data);
  } catch (error) {
    // Відправлення помилки як відповідь у разі виникнення помилки
    res.status(500).json({ error: error.message });
  }
};

module.exports = handler;