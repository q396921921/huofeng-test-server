'use strict';
const moment = require('moment');
const utility = require('utility');

const Service = require('egg').Service;

class SignService extends Service {
  /**
   * 创建一个新用户
   *
   * @param {String} phone 手机号
   * @param {String} password 密码
   * @returns
   * @memberof SignService
   */
  async createUser(phone, password) {
    const { ctx } = this;
    const totalUser = await ctx.model.User.find({ phone });
    if (totalUser.length !== 0) {
      // 证明用户已经存在
      ctx.code = 400001;
      ctx.msg = "该手机号已经存在，创建失败，请重新输入";
      throw new Error();
    } else {
      password = utility.md5(password, 'hex');
      password = utility.sha1(password, 'hex');
      await ctx.model.User.create({ phone, password });
      const token = this.app.jwt.sign({
        phone,
      }, this.app.config.jwt.secret);
      await this.app.redis.set(phone, token);
      await this.app.redis.expire(phone, 3600);
      return { msg: '创建成功', token };
    }
  }
  /**
   * 签到
   *
   * @param {String} phone 手机号
   * @returns
   * @memberof SignService
   */
  async sign (phone) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({ phone });
    let signStartDate = user.signStartDate;
    if (user.isSign === 1) {
      ctx.code = 400002;
      ctx.msg = "您今天已经签到，无法重复签到";
      throw new Error();
    }
    const _id = user._id.toString();
    let totalSign = user.totalSign; // 当前连续签到数
    const globalDate = user.globalDate; // 当前此用户对应的系统日期
    const oldScore = user.totalScore; // 用户当前总分数
    const signObj = await this.app.sign(totalSign, globalDate, signStartDate, oldScore);
    await ctx.model.User.updateOne({ _id }, { signStartDate: signObj.signStartDate, totalSign: signObj.totalSign, isSign: 1, totalScore: signObj.newScore });
    const time = globalDate ? globalDate + ' ' + moment().format('HH:mm') : moment().format('YYYY-MM-DD HH:mm');
    await ctx.model.Sign.create({ userId: _id, date: signObj.date, time, score: signObj.insertScore });
    let msg = '恭喜您,签到成功';
    let result = true;
    return { msg, result, insertScore: signObj.insertScore }
  }
  /**
   * 设置系统时间✔
   *
   * @param {String} globalDate 系统时间【上下都可调,到第二天会被定时器重置回正常时间】
   * @returns
   * @memberof SignService
   */
  async setGlobalDate(phone, globalDate) {
    const ctx = this.ctx;
    const user = await ctx.model.User.findOneAndUpdate({ phone }, { globalDate });
    const userId = user._id.toString();
    // 此人要修改的日期,是否在此日已经有过签到记录
    const res = await this.ctx.model.Sign.findOne({ userId, date: globalDate });
    // 有，将此时签到状态置为1
    if (res) {
      await ctx.model.User.updateOne({ _id: userId }, { isSign: 1 });
    } else {
      await ctx.model.User.updateOne({ _id: userId }, { isSign: 0 });
    }
    return { msg: '设置系统时间成功', result: true };
  }

  /**
   * 判断登录用户是否合法
   *
   * @param {String} phone 手机号
   * @param {String} password 密码
   * @returns
   * @memberof SignService
   */
  async login (phone, password) {
    const { ctx } = this;
    password = utility.md5(password, 'hex');
    password = utility.sha1(password, 'hex');
    const user = await ctx.model.User.findOne({ phone, password });
    if (user && user.length !== 0) {
      const token = this.app.jwt.sign({
        phone,
      }, this.app.config.jwt.secret);
      await this.app.redis.set(phone, token);
      await this.app.redis.expire(phone, 3600);
      return { data: true, token };
    } else {
      return { data: false, msg: '密码错误' };
    }
  }
  /**
   * 获得用户的信息情况
   *
   * @param {String} phone 手机号
   * @returns
   * @memberof SignService
   */
  async getUserInfo(phone) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({ phone });
    return user;
  }
}

module.exports = SignService;
