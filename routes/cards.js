const cards = require('express').Router();
const { celebrate } = require('celebrate');

const { id, card } = require('../utils/validation');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.put('/:id/likes', celebrate(id), likeCard);
cards.delete('/:id/likes', celebrate(id), dislikeCard);
cards.delete('/:id', celebrate(id), deleteCard);
cards.get('/', getCards);
cards.post('/', celebrate(card), createCard);

module.exports = cards;
