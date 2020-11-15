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

module.exports = {
  generatePin
};