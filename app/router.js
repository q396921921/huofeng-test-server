'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/sign')(app);
  require('./router/score')(app);
};