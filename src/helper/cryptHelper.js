const bcrypt = require('bcrypt');
const saltRounds = 12;

module.exports = (() => {
  'use strict';
  function getHashFromPasswordSync(password) {
    return bcrypt.hashSync(password, saltRounds);
  }

  function isPasswordCorrectSync(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  return {
    getHashFromPasswordSync,
    isPasswordCorrectSync
  };
})();
