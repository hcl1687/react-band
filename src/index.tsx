import '@babel/polyfill'
import RBCore from '~/core'
import config from '~/config'
import queryString from 'query-string'

const parsed = queryString.parse(location.search)
const locale = (parsed.locale || 'en') as string
const theme = (parsed.theme || 'default') as string
RBCore.create({
  ...config,
  locale,
  theme
}).mount()
