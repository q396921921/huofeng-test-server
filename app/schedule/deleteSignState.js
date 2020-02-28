const Subscription = require('egg').Subscription;

const moment = require('moment');
// 此定时器主要是为了,将每天的签到情况进行重置
class DeleteSignState extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 0 * * *', //每周一的5点30分0秒更新
        type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const users = await ctx.model.User.find();
    for (const user of users) {
      let totalSign = user.totalSign;
      let signStartDate = user.signStartDate;
      const date = moment().format('YYYY-MM-DD');
      // 连续签到只是将今天的签到情况重新变为未签到0
      // 断了隔了1天了，就将开始时间置为空，签到情况变为0【开始时间不置空了，只有断签重签之后才会变为新的值】
      if (signStartDate && moment(signStartDate).add(totalSign, 'days').format('YYYY-MM-DD') === date) {
        await this.ctx.model.User.updateOne({ isSign: 0 });
      } else {
        await this.ctx.model.User.updateOne({ isSign: 0 });
      }
    }
    // 查找今天所有已经有签到记录的人
    const allSignRecords = await this.ctx.model.Sign.find({ date });
    const allSignUsers = [];
    for (const record of allSignRecords) {
      const userId = record.userId.toString();
      allSignUsers.push(userId);
    }
    // 将所有今天已经有过签到记录的人的签到状态变为已签到
    await this.ctx.model.User.updateMany({ _id: { $in: allSignUsers } }, { isSign: 1, globalDate: '' });
  }
}

module.exports = DeleteSignState;