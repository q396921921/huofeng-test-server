'use strict';
const moment = require('moment');
const Command = require('egg-artisan');

class TestCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('test command');

    this.yargs.options({
      a: {
        type: 'string',
        description: 'test schedule',
      },
    });
  }

  async run({ argv }) {
    // const aa = argv.a || '';
    // const bb = argv.b || '';
    // const cc = argv._.join(',');
    // await this.ctx.service.file.write(`argv: ${aa}${bb}${cc}`);
    // const con = await this.ctx.service.file.read();
    // console.log('argv', argv);
    // return con;
    const users = await this.ctx.model.User.find();
    for (const user of users) {
      let totalSign = user.totalSign;
      // 如果已经连续签到7天了，在第二天凌晨将连续和签到状态都置为0，并且开始日期也置为空
      if (totalSign === 7) {
        totalSign = 0;
        await this.ctx.model.User.updateOne({
          signStartDate: '',
          totalSign,
          isSign: 0
        });
      } else {
        let signStartDate = user.signStartDate;
        const date = moment().format('YYYY-MM-DD');
        // 连续签到只是将今天的签到情况重新变为未签到0
        // 断了隔了1天了，就将开始事件置为空，签到情况变为0
        if (signStartDate && moment(signStartDate).add(totalSign, 'days').format('YYYY-MM-DD') === date) {
          await this.ctx.model.User.updateOne({
            isSign: 0
          });
        } else {
          totalSign = 0;
          signStartDate = '';
          await this.ctx.model.User.updateOne({
            totalSign,
            signStartDate,
            isSign: 0
          });
        }
      }
    }
  }

  get description() {
    return 'test description';
  }
}

module.exports = TestCommand;