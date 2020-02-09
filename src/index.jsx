import '@babel/polyfill'
import RBCore from '~/core'
import queryString from 'query-string'

const parsed = queryString.parse(location.search)
const locale = parsed.locale || 'en'
const theme = parsed.theme || 'default'
RBCore.create({
  locale,
  theme
}).mount()
