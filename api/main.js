// const axios = require('axios');

// const API_KEY = 'f43dca3cc3adf948f925bbaca319b0200f77d502ae3eb69cf9b3101f1c999771';
// const COLLECTION_ID = '662668afb17cfdeddcaffbee';

// axios.get(`https://api.webflow.com/collections/${COLLECTION_ID}/items`, {
//   headers: {
//     'Authorization': `Bearer ${API_KEY}`
//   }
// })
// .then(response => {
//   console.log(response.data); // Обробіть дані відповіді відповідним чином
// })
// .catch(error => {
//   console.error('Помилка при отриманні даних з Webflow:', error);
// });



const app = require('axios')();
app.get("/",(req, res)=>{
    res.send("hello from express")
})