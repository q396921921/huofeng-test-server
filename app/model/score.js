module.exports = app => {
  const mongoose = app.mongoose;
  const ScoreSchema = new mongoose.Schema({
    // 连续签到次数
    totalSigns: {
      type: Number,
      default: 1,
    },
    // 对应分数
    score: {
      type: Number,
      default: 0,
    }
  }, {
    timestamps: true,
  });
  return mongoose.model('Score', ScoreSchema);
};