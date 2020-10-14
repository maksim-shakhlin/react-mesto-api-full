const handleErrorDecorator = (func) => {
  function decoratedFunc(req, res, next) {
    func(req, res).catch(next);
  }
  return decoratedFunc;
};

module.exports.enableErrorHandling = (
  object,
  decorator = handleErrorDecorator,
) => {
  const newObject = { ...object };
  Object.keys(newObject).forEach((key) => {
    if (typeof newObject[key] === 'function') {
      newObject[key] = decorator(newObject[key]);
    }
  });
  return newObject;
};
