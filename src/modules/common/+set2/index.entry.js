import i18nDeco from './decorators/i18n/index.entry'
import layoutDeco from './decorators/layout/index.entry'
import localStoreDeco from './decorators/localStore/index.entry'
import noticeDeco from './decorators/notice/index.entry'
import themeDeco from './decorators/theme/index.entry'

export default () => {
  return {
    '@i18n': i18nDeco,
    '@layout': layoutDeco,
    '@localStore': localStoreDeco,
    '@notice': noticeDeco,
    '@theme': themeDeco
  }
}
