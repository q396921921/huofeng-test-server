module.exports = app => {
    const mongoose = app.mongoose;
    const SignSchema = new mongoose.Schema({
      // 此处可以记录，也可以不记录，看要求
      // 签到者userId,关联user表
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      // 签到日期时间YYYY-MM-DD
      date: {
        type: String,
        default: '',
      },
      // 签到日期时间YYYY- MM - DD HH: mm
      time: {
        type: String,
        default: '',
      },
      // 本次加分情况
      score: {
        type: Number,
        default: 0
      }
    }, {
      timestamps: true,
    });
    return mongoose.model('Sign', SignSchema);
};