const Router = require('@koa/router')
const FuckingController = require('./FuckingController')

const router = new Router();
const fuckingContoller = new FuckingController();


const redirectToRoot = ctx => ctx.response.redirect('/')

/**
 * 
 * @param {Application} app 
 */
module.exports = function initController(app) {
  router.get('/index', redirectToRoot);
  router.get('/login', redirectToRoot);
  router.post('/fucking/getToken', fuckingContoller.getToken);

  app
    .use(router.routes())
    .use(router.allowedMethods());
}