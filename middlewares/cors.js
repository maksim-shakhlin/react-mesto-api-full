const { whitelist } = require('../utils/options');

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  if (whitelist.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  next();
};
