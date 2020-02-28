/**
 * 处理成功的相应
 */
/**
 * 处理成功返回的数据对象
 *
 * @param {Object} ctx 
 * @param {Object} [res=null] 实际返回的对象
 * @param {string} [msg='request success'] 默认为请求成功
 * @param {number} [code=200] 默认为200
 */
exports.setObj = (ctx, res = null, msg = 'request success', code = 200) => {
  const ts = (0 | Date.now() / 1000).toString();
  ctx.body = { code, msg, ts, data: res };
};