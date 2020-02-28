'use strict';
const path = require('path');

/** @type Egg.EggPlugin */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
exports.jwt = {
  enable: true,
  package: "egg-jwt"
};
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
// exports.sign = {
//   enable: true,
//   path: path.join(__dirname, '../app/lib/plugin/egg-sign'),
// }
exports.aaaa = {
  enable: true,
  package: 'egg-test3',
}