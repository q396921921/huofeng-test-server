'use strict';

const Controller = require('egg').Controller;
const rule = require('./rule/sign');
const moment = require('moment');

class SignController extends Controller {
  // 创建用户
  async createUser() {
    const { ctx, service } = this;
    ctx.validate(rule.createUser, ctx.request.body);
    const { phone, password } = ctx.request.body;
    const result = await service.sign.createUser(phone, password);
    ctx.helper.setObj(ctx, result);
  }
  // 登录
  async login() {
    const { ctx, service } = this;
    ctx.validate(rule.createUser, ctx.request.body);
    const { phone, password } = ctx.request.body;
    const result = await service.sign.login(phone, password);
    ctx.helper.setObj(ctx, result);
  }
  // 签到
  async sign() {
    const { ctx, service } = this;
    const phone= ctx.state.user.phone;
    const result = await service.sign.sign(phone);
    ctx.helper.setObj(ctx, result);
  }
  // 获得用户今天的签到情况
  async getUserSign() {
    const { ctx, service } = this;
    const phone= ctx.state.user.phone;
    const result = await service.sign.getUserSign(phone);
    ctx.helper.setObj(ctx, result);
  }
  // 获取用户的详细信息
  async getUserInfo() {
    const { ctx, service } = this;
    const phone= ctx.state.user.phone;
    const result = await service.sign.getUserInfo(phone);
    ctx.helper.setObj(ctx, result);
  }
  // 修改系统时间
  async setGlobalDate() {
    const { ctx, service } = this;
    const { userId, globalDate } = ctx.request.body;
    const result = await service.sign.setGlobalDate(userId, globalDate);
    ctx.helper.setObj(ctx, result);
  }
  // 获得系统时间
  async getGlobalDate() {
    const { ctx } = this;
    const phone= ctx.state.user.phone;
    const user = await ctx.model.User.findOne({ phone });
    const globalDate = user.globalDate;
    const date = globalDate ? globalDate : moment().format('YYYY-MM-DD');
    ctx.helper.setObj(ctx, { date });
  }
}

module.exports = SignController;
