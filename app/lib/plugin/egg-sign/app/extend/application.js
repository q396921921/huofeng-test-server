'use strict'
const moment = require('moment');

module.exports = {
  /**
     * 获得签到日期,所得分数,以及最新连续签到次数【如果传递当前分数则增加返回项newScore】
     *
     * @param {Number} totalSign 当前连续签到次数
     * @param {String} [globalDate=''] 当前用户的系统签到日期[YYYY-MM-DD]
     * @param {String} signStartDate 开始签到日期[YYYY-MM-DD]
     * @param {Number} [nowScore=0] 当前用户分数
     * @returns {Object} { insertScore, date }
     */
  sign (totalSign, globalDate = '', signStartDate, nowScore = -1) {
    // 如果此人系统时间有值就用系统时间
    const date = globalDate ? globalDate : moment().format('YYYY-MM-DD');
    // 如果签到开始日期加上连续签到天数等于今天就证明没有断签，否则将连续签到天数先置为0再累加
    if (signStartDate && moment(signStartDate).add(totalSign, 'days').format('YYYY-MM-DD') === date) {
      totalSign = ++totalSign
    } else {
      // 过去开始时间比系统时间要靠后【开始19号，系统修改为18号，再签到开始不应该变成18号】
      if (signStartDate && moment(signStartDate).diff(moment(date)) < 1) {
        signStartDate = date;
        totalSign = 1;
      }
    }
    if (!signStartDate && !globalDate) {
      signStartDate = date;
      totalSign = 1;
    }
    // 拿到配置中的签到天数对应的分值
    const scoreRules = this.config.sign.signScore;
    const insertScore = getScore(totalSign, scoreRules);
    let result = {};
    if (nowScore != -1) {
      const newScore = nowScore + insertScore;
      result = { insertScore, date, totalSign, newScore };
    } else {
      result = { insertScore, date, totalSign, };
    }
    return result;
  },
  /**
   * 获得连续天数对应的分数列表
   *
   * @returns {Array<Object>}
   */
  getScoreList () {
    const res = this.config.sign.signScore;
    let scoreList = [];
    for (const k in res) {
      if (res.hasOwnProperty(k)) {
        const score = res[k];
        scoreList.push(score);
      }
    }
    return scoreList;
  },
  /**
   * 修改连续天数对应的分值
   *
   * @param {Number} days 连续天数
   * @param {Number} score 分数
   * @returns {Boolean} 成功true/失败false
   */
  updateScore (days, score) {
    let flag = true;
    if (days === 1) {
      this.config.sign.signScore.one = score;
    } else if (days === 2) {
      this.config.sign.signScore.two = score;
    } else if (days === 3) {
      this.config.sign.signScore.three = score;
    } else if (days === 4) {
      this.config.sign.signScore.four = score;
    } else if (days === 5) {
      this.config.sign.signScore.five = score;
    } else if (days === 6) {
      this.config.sign.signScore.six = score;
    } else if (days === 7) {
      this.config.sign.signScore.seven = score;
    } else {
      flag = false;
    }
    return flag;
  }
}
/**
 * 传入签到天数，获得对应的分数
 *
 * @param {Number} day 签到天数
 * @param {Object} scoreRules 加分规则
 * @returns {Number} 分数
 */
function getScore (day, scoreRules) {
  if (day === 1) {
    return scoreRules.one;
  } else if (day === 2) {
    return scoreRules.two;
  } else if (day === 3) {
    return scoreRules.three;
  } else if (day === 4) {
    return scoreRules.four;
  } else if (day === 5) {
    return scoreRules.five;
  } else if (day === 6) {
    return scoreRules.six;
  } else if (day >= 7) {
    return scoreRules.seven;
  } else {
    return 5;
  }
}