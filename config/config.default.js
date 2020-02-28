/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1582512762893_7707';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  config.proxy = true;
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
    domainWhiteList: ['*'],
  };

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  config.mongoose = {
    client: {
      url: 'mongodb://192.168.252.49:27017/test',
      poolSize: 20,
      options: {
        auth: { authSource: 'test' },
        user: 'test',
        pass: 'test',
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  };
  config.cluster = {
    listen: {
      port: 2332,
      hostname: '0.0.0.0',
    },
  };
  config.onerror = {
    all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.set('Content-Type', 'application/json');
      // eslint-disable-next-line no-bitwise
      const ts = (0 | Date.now() / 1000).toString();
      err.stack = err.stack.replace(/[\r\n]/g, '');
      ctx.body = JSON.stringify({ code: err.status, msg: err.message, stack: err.stack, ts });
      ctx.status = 509;
    },
  };
  exports.logger = {
    outputJSON: true,
  };
  return config;
};
