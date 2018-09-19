const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let config = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
    // 将 第三方依赖 单独打包
    vendor: [
      'react',
      'react-dom',
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[id]_[name].[chunkhash:8].js',
    publicPath: ''
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
            presets: [
              [
                'env',
                {
                  // 默认选项为false, 表示babel-polyfill全部引入, 会导致全局污染
                  // 选项为true, babel-polyfill按需引入, 会导致全局污染
                  useBuiltIns: true
                }
              ],
              'react',
              'stage-0'
            ],
            plugins: [['import', { libraryName: 'antd-mobile', style: 'css' }]],
          }
        }
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // modules: true,
                // camelCase: true,
                // localIdentName: '[name]_[local]_[hash:base64:5]',
                minimize: true
              }
            }
          ]
        })
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new ExtractTextPlugin('css/[name].[contenthash:8].css'),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: __dirname + '/static',
        to: __dirname + '/dist/static'
      }
    ])
  ]
}

module.exports = config
