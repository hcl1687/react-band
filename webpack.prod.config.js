const TerserPlugin = require('terser-webpack-plugin')
const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin()]
    // minimize: false
  }
})
