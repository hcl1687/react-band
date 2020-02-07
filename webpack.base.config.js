const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')
const pkgPath = path.resolve(process.cwd(), 'package.json')
const fileContent = fs.readFileSync(pkgPath, 'utf-8')
const pkg = JSON.parse(fileContent)
const src = path.resolve(__dirname, './src')
const dist = path.resolve(__dirname, './dist')

const cssLoaders = [{
  loader: 'style-loader'
},
{
  loader: 'css-loader',
  options: {
    modules: {
      mode: 'local',
      localIdentName: '[local]--[hash:base64:5]'
    }
  }
},
{
  loader: 'postcss-loader',
  options: {
    plugins: [
      require('postcss-import')(),
      require('postcss-url')(),
      require('postcss-nesting')(),
      require('postcss-cssnext')
    ]
  }
}]

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.bundle.js',
    path: dist,
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
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
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: cssLoaders.shift().loader,
        use: cssLoaders
      })
    }, {
      test: /\.css$/,
      include: /node_modules\/antd/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'style-loader'
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
    extensions: ['*', '.js', '.jsx', '.css', '.json'],
    alias: {
      '~': src
    }
  },
  plugins: [
    new ExtractTextPlugin('index.css'),
    new HtmlWebpackPlugin({
      template: './template/index.ejs',
      title: `${pkg.name} ${pkg.description}`,
      filename: './index.html'
    })
  ]
}
