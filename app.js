const express = require('express');
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.config.dev');

let app = express();
let compiler = webpack(webpackConfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: '/',
  stats: {
    colors: true, // console统计日志带颜色输出
    chunks: false,
  },
});

let hotMiddleware = require('webpack-hot-middleware')(compiler);
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
let staticPath = path.posix.join('/', 'static');
app.use(staticPath, express.static('./static'));

module.exports = app.listen(8080, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  let uri = 'http://localhost:' + 8080;
  console.log('Listening at ' + uri + '\n');
});
