// 思路：这里就按比较多的连续签到来说，也就是不论时间只要是连续签到即可【而不是累积签到7天】
// 情况1：user表中一个签到开始时间，一个今天是否签到，如果今天签到了（1），签到次数加1
// 情况2：今天未签到（0），将签到开始时间置空，然后将签到次数置为0
// 情况3：签到了次数满7天了，将签到开始时间置空，然后将签到次数置为0。

module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    // 此处可以记录，也可以不记录，看要求
    // 手机号（唯一）
    phone: {
      type: String,
      default: '',
    },
    // 密码
    password: {
      type: String,
      default: '',
    },
    // 签到开始日期
    signStartDate: {
      type: String,
      default: '',
    },
    // 今天是否已经签到
    isSign: {
      type: Number,
      default: 0,
    },
    // 签到次数
    totalSign: {
      type: Number,
      default: 0,
    },
    // 用户累计分数
    totalScore: {
      type: Number,
      default: 0
    },
    // 全局时间[修改系统时间只会针对个人进行修改不会影响其他人的签到，等到达第二天凌晨时，会自动重置为空也就是正常时间]
    globalDate: {
      type: String,
      default: ''
    }
  }, {
    timestamps: true,
  });
  return mongoose.model('User', UserSchema);
};