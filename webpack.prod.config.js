const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')

const config = merge(baseConfig('production'), {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin()]
    // minimize: false
  }
})

config.plugins.unshift(new CleanWebpackPlugin())

module.exports = config
