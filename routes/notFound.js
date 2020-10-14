const notFound = require('express').Router();

notFound.all('/', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = notFound;