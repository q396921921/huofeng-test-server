const moment = require('moment');
const jwt =  require('jsonwebtoken');

module.exports = (options, app) => {
  return async function judgeJwt (ctx, next) {
    let allow = true; // 默认允许放行
    const requestUrl = ctx.request.url;
    const ignoreUrl = ['/api/v1/sign/login', '/api/v1/sign/createUser'];
    // 不包含上面两个需要过滤的url
    if (!ignoreUrl.includes(requestUrl)) {
      let token = ctx.request.header.authorization;
      // 判断是否带着token
      if (token) {
        token = token.split('Bearer ')[1];
        // 判断解析后token是否正确
        if (token) {
          tokenObj = jwt.decode(token);
          const phone = tokenObj.phone;
          const rdstk = await app.redis.get(phone);
          // redis中存在并且一致，证明当前登录人并未改变，是合法的
          if (rdstk && rdstk === token) {
            await next();
          } else {
            // 如果rdstk没值但传过来的解析正确的token是有值的，证明失效了，重新生成一个并存入
            if (!rdstk) {
              const newToken = this.app.jwt.sign({
                phone,
              }, this.app.config.jwt.secret);
              await this.app.redis.set(phone, newToken);
              await next();
            } else {
              // rdstk有值却和传入的不一样，证明在a登录的状态下，b又登录并重置了redis中的token，所以此时a传入的token与存储的不一致，此时让a重新登录
              ctx.status = 500;
              ctx.body = { code: 400004, msg: '你的账号已在其他地方登录，请重新登录' };
            }
          }
        } else {
          allow = false;
        }
        
      } else {
        allow = false;
      }
      if (!allow) {
        ctx.status = 500;
        ctx.body = { code: 400003, msg: '登录失效请重新登录' };
      }
    } else {
      await next();
    }
  }
};