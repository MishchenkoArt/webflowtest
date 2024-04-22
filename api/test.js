
const axios = require('axios').default;

const API_KEY = 'f43dca3cc3adf948f925bbaca319b0200f77d502ae3eb69cf9b3101f1c999771';
const COLLECTION_ID = '662668afb17cfdeddcaffbee';

module.exports.handler = async (req, res) => {
  try {
    const response = await axios.get(`https://api.webflow.com/collections/${COLLECTION_ID}/items`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    res.status(200).json(response.data); // Повернення даних як відповідь
  } catch (error) {
    res.status(error.response.status).json({ error: error.message }); // Повернення помилки як відповідь
  }
};