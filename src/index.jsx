import '@babel/polyfill'
import RBCore from '~/core'
import config from '~/config'
import queryString from 'query-string'

const parsed = queryString.parse(location.search)
const locale = parsed.locale || 'en'
const theme = parsed.theme || 'default'
RBCore.create({
  ...config,
  locale,
  theme,
  exclude: /demo\//
}).mount()
