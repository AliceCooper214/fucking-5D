const Router = require('@koa/router')
const FuckingController = require('./FuckingController')

const router = new Router();
const fuckingContoller = new FuckingController();

/**
 * 
 * @param {Application} app 
 */
module.exports = function initController(app) {
  router.get('/index', (ctx) => ctx.response.redirect('/'));
  router.get('/login', (ctx) => ctx.response.redirect('/'));
  router.post('/fucking/getToken', fuckingContoller.getToken);

  app
    .use(router.routes())
    .use(router.allowedMethods());
}