function isUrl(string) {
  const regExp = /^https?:\/\/(www\.)?([\w-]{1,}\.){1,}[a-z]{1,}(\/.*)*$/i;
  return regExp.test(string);
}

function isPassword(string) {
  const regExp = /^[\w!@#$%^&*()\-_+=;:,./?\\|`~[\]{}<>"']*$/i;
  return regExp.test(string);
}

function isName(string) {
  const regExp = /^[a-zА-яё\s-]{1,}$/i;
  return regExp.test(string);
}

module.exports = {
  isUrl,
  isName,
  isPassword,
};
