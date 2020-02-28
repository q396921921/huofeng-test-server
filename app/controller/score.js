'use strict';

const Controller = require('egg').Controller;

class ScoreController extends Controller {
  // 修改
  async update() {
    const { ctx } = this;
    const { totalSigns, score } = ctx.request.body;
    const res = await this.app.updateScore(totalSigns, score);
    if (res) {
      ctx.helper.setObj(ctx, {}, '修改成功');
    } else {
      ctx.helper.setObj(ctx, {}, '修改失败');
    }
  }
  // 分数列表
  async list() {
    const { ctx } = this;
    const res = await this.app.getScoreList();
    ctx.helper.setObj(ctx, res);
  }
}

module.exports = ScoreController;
