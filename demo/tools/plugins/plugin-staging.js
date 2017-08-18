
'use strict';

const io = require('hf/core/io');


module.exports = function (options) {

  return io.readContent('./readme.md')
    .then((content) => {
      options.logInfo(content)
    });
};
