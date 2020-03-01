/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1582512762893_7707';

  config.sign = {
    signScore: {
      // one: 1,
    }
  };

  config.jwt = {
    secret: "123456"
  };
  // add your middleware config here
  config.middleware = ['judgeJwt'];

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
      url: 'mongodb://47.95.226.238:27017/test',
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
      port: 2333,
      hostname: '0.0.0.0',
    },
  };
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '47.95.226.238',   // Redis host
      password: 'test',
      db: 0,
    },
  }
  config.onerror = {
    all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      const ts = (0 | Date.now() / 1000).toString();
      ctx.set('Content-Type', 'application/json');
      err.stack = err.stack.replace(/[\r\n]/g, '');
      ctx.body = JSON.stringify({
        code: ctx.code ? ctx.code : 500, // 错误的默认错误码是500
        msg: ctx.msg ? ctx.msg : 'server error',  // 错误的默认提示
        stack: err.stack,
        ts
      });
    }
  };
  exports.logger = {
    outputJSON: true,
  };
  return config;
};
