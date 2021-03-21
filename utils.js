const idLength = 8;
const { nanoid } = require('nanoid');

const setId = () => nanoid(idLength);
const normalizeAmout = amount => +amount.toFixed(4);
const getAmount = arr => arr.reduce(
  (acc, product) => {
    acc += product.price;
    return acc;
  }, 0);
const getCost = arr => normalizeAmout(getAmount(arr));

module.exports = { setId, getCost, getAmount };
