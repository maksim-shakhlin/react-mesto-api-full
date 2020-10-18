const cleanSpaces = (string) => {
  return string.replace(/\s+/g, ' ').trim();
};

module.exports.cleanSpaces = cleanSpaces;

module.exports.cleaner = (keys) => {
  return (key, value) => {
    if (keys.includes(key)) {
      return cleanSpaces(value);
    }
    return value;
  };
};

module.exports.cleanCreated = (object, ...keys) => {
  const cleaned = { ...object._doc };
  keys.forEach((key) => delete cleaned[key]);
  return cleaned;
};
