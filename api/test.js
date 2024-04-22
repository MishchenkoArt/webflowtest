const axios = require('axios').default;

const API_KEY = 'f43dca3cc3adf948f925bbaca319b0200f77d502ae3eb69cf9b3101f1c999771';
const COLLECTION_ID = '662668afb17cfdeddcaffbee';

const handler = async (req, res) => {
  try {
    // Отримання даних з тіла запиту, які містяться в полі email
    const { email } = req.body;
    console.log('Received email:', email);
    // Перевірка чи є електронна пошта у тілі запиту
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Вивід електронної пошти в консоль
    console.log('Received email:', email);

    // Повернення отриманої електронної пошти як відповідь
    res.status(200).json({ email });
  } catch (error) {
    // Відправлення помилки як відповідь у разі виникнення помилки
    res.status(500).json({ error: error.message });
  }
};

module.exports = handler;