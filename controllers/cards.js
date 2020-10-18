const { enableErrorHandling } = require('../utils/error-handling');
const { Err, FORBIDDEN, NO_SUCH_CARD_ID } = require('../utils/errors');
const Card = require('../models/card');
const { cleanCreated } = require('../utils/utils');

const getCards = (req, res) => {
  return Card.find({}).then((cards) => res.send(cards));
};

const deleteCard = (req, res) => {
  return Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new Err(NO_SUCH_CARD_ID);
      }

      if (card.owner.toString() !== req.user._id) {
        throw new Err(FORBIDDEN);
      }
      return Card.findByIdAndDelete(req.params.id);
    })
    .then(() => res.status(204).end());
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id }).then((card) => {
    res.status(201).send(cleanCreated(card, '__v'));
  });
};

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new Err(NO_SUCH_CARD_ID);
    }
    res.send(card);
  });
};

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new Err(NO_SUCH_CARD_ID);
    }
    res.send(card);
  });
};

module.exports = enableErrorHandling({
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
});
