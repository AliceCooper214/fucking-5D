const Koa = require('koa')
const app = new Koa()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const initController = require('./controller')

app.use(static('./public'))
app.use(bodyParser())
app.use(historyApiFallback({
  index: '/',
  whiteList: ['/fucking', '/index', 'login']
}))
initController(app)

app.listen(3000, () => {
  console.log('server port: http://localhost:3000');
})