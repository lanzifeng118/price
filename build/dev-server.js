require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
// 自定义模拟数据
var apiRoutes = express.Router(); //创建一个路由实例
var appData = require('../data.json')
var infoList = appData.infoList;
var infoDisplay = appData.infoDisplay;

var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)
var appHypo = require('../../backend/app.js');
app.use('/', appHypo);

// apiRoutes.post('/admin/basicinfo', function(req, res){ //获取数据
//   res.json({
//     code: '200',
//     data: appData.basicInfo
//   })
// })
//
// apiRoutes.post('/admin/user', function(req, res){ //获取数据
//   res.json({
//     code: '200',
//     data: appData.user
//   })
// })
//
// apiRoutes.post('/admin/infoDisplay', function(req, res){ //获取数据
//   var id = 'id_' + req.query.id
//   res.json({
//     errno: 0,
//     data: infoDisplay[id]
//   })
// })
//
// apiRoutes.post('/admin/aboutus', function(req, res){
//   res.json({
//     code: '200',
//     data: infoList
//   })
// })
// apiRoutes.post('/admin/productList', function(req, res){
//   res.json({
//     code: '200',
//     data: appData.productList
//   })
// })
// apiRoutes.post('/admin/experienceList', function(req, res){
//   res.json({
//     code: '200',
//     data: appData.experienceList
//   })
// })
//
// app.use('/api',apiRoutes)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
