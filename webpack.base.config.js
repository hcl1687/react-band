const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const pkgPath = path.resolve(process.cwd(), 'package.json')
const fileContent = fs.readFileSync(pkgPath, 'utf-8')
const pkg = JSON.parse(fileContent)
const src = path.resolve(__dirname, './src')
const src_build = path.resolve(__dirname, './src_build')
const dist = path.resolve(__dirname, './dist')
const staticDir = path.resolve(__dirname, './static')
const NODE_ENV = process.env.NODE_ENV
const RB_ENV = process.env.RB_ENV

const cssLoadersFactory = function (isGlobal) {
  return [{
    loader: 'style-loader'
  },
  {
    loader: 'css-loader',
    options: {
      modules: isGlobal ? {
        mode: 'global'
      } : {
        mode: 'local',
        localIdentName: '[local]--[hash:base64:5]'
      }
    }
  },
  {
    loader: 'less-loader'
  }]
}

const cssLoaders = cssLoadersFactory()
const cssGlobalLoaders = cssLoadersFactory(true)

module.exports = (env) => {
  const entry = env !== 'production' ? './src/index.tsx' : './src_build/index.tsx'
  const srcPath = env !== 'production' ? src : src_build
  const filename = env !== 'production' ? '[name].bundle.js' : '[name].[contenthash].bundle.js'
  const chunkFilename = env !== 'production' ? '[name].chunk.bundle.js' : '[name].[contenthash].chunk.bundle.js'

  return {
    entry,
    output: {
      filename,
      chunkFilename,
      path: dist,
      publicPath: '/'
    },
    module: {
      rules: [{
        test: /\.(ts|js)x?$/,
        include: src,
        use: [{
          loader: 'eslint-loader',
          options: {
            emitWarning: true, // show warning in development, you must solve it
            formatter: require('eslint-friendly-formatter')
          }
        }],
        enforce: 'pre'
      }, {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
      }, {
        test: /(?<!\.global)\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: cssLoaders.shift().loader,
          use: cssLoaders
        })
      }, {
        test: /\.global.css$/,
        use: ExtractTextPlugin.extract({
          fallback: cssGlobalLoaders.shift().loader,
          use: cssGlobalLoaders
        })
      }, {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name].[ext]?[hash:7]'
          }
        }]
      }]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.css', '.json'],
      alias: {
        '~': srcPath
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.RB_ENV': JSON.stringify(RB_ENV)
      }),
      new HtmlWebpackPlugin({
        template: './template/index.ejs',
        title: `${pkg.name} ${pkg.description}`,
        filename: './index.html'
      }),
      new StyleLintPlugin({
        context: srcPath,
        files: '**/*.css',
        failOnError: false,
        quiet: true,
        syntax: 'less'
      }),
      new ExtractTextPlugin('index.css'),
      new CopyWebpackPlugin({
        patterns: [{
          from: staticDir
        }]
      })
    ]
  }
}
