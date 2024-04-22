
const axios = require('axios').default;

const API_KEY = 'f43dca3cc3adf948f925bbaca319b0200f77d502ae3eb69cf9b3101f1c999771';
const COLLECTION_ID = '662668afb17cfdeddcaffbee';

module.exports.handler = async (req, res) => {
  console.log("hello"); // Вивести "hello" у консоль
  res.status(200).json({ message: "hello" }); // Повернення "hello" як відповідь
};