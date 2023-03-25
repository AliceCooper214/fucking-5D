const bootstrap = require("../api");

let token = ''

module.exports = class FuckingContoller {
  /**
   * 
   * @param {Koa.Context} ctx 
   */
  async getToken(ctx) {
    // this.#token = await ctx.request.body?.token
    token = ctx.request.body.token
    ctx.status = 200;

    console.log(bootstrap);
    const returnObj = await bootstrap(token)

    ctx.body = {
      msg: 'ok',
      data: returnObj
    }
  }

}