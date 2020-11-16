require('dotenv').config();

const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generatePin = () => {
	const len = dictionary.length;
    let pinCodeArray = '';
    for (let i = 0; i < process.env.PIN_LENGTH; i++) {
		const index = Math.floor(Math.random() * len);
    	pinCodeArray += dictionary[index];
    }
    return pinCodeArray;
}

const sanitizeString = (str) => {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '');
  return str.trim();
}

module.exports = {
  generatePin,
  sanitizeString
};