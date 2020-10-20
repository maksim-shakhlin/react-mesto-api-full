module.exports = (err, req, res, next) => {
  if (!res.headersSent) {
    const code =
      (['ValidationError', 'CastError'].includes(err.name) && 400) ||
      err.statusCode ||
      500;
    const message = (code === 500 && 'Ошибка на сервере') || err.message;
    res.status(code).send({ message });
  }
  next();
};
