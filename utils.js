const idLength = 8;
const { nanoid, customAlphabet } = require('nanoid');

const nanoidNum = customAlphabet('1234567890', idLength);

const setId = () => nanoid(idLength);
const setIdNum = () => nanoidNum();
const normalizeAmout = amount => +amount.toFixed(4);
const getAmount = arr => arr.reduce(
  (acc, product) => {
    acc += product.price;
    return acc;
  }, 0);
const getCost = arr => normalizeAmout(getAmount(arr));

module.exports = { setId, getCost, getAmount, setIdNum};
