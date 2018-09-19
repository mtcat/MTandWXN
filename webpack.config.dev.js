const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let config = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?noInfo=true&reload=true',
    path.resolve(__dirname, 'src/index.js')
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    chunkFilename: '[id]_[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-0'],
            plugins: [['import', { libraryName: 'antd-mobile', style: 'css' }]],
            env: {
              development: {
                presets: ['react-hmre']
              }
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
            // options: {
            //     modules: true,
            //     camelCase: true,
            //     localIdentName: '[name]_[local]_[hash:base64:5]',
            // }
          }
        ]
      },
      {
        test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000, name: 'assets/[name].[ext]' }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html'
    }),
    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),
    // dev模式下可以提示错误、测试报告等, production模式不提示
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

module.exports = config
