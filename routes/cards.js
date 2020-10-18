const cards = require('express').Router();

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  idValidator,
  cardValidator,
} = require('../middlewares/request-validators');

cards.put('/:id/likes', idValidator, likeCard);
cards.delete('/:id/likes', idValidator, dislikeCard);
cards.delete('/:id', idValidator, deleteCard);
cards.get('/', getCards);
cards.post('/', cardValidator, createCard);

module.exports = cards;
