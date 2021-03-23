import antdIcon from './modules/antdIcon/index.entry'
import app from './modules/app/index.entry'
import constants from './modules/constants/index.entry'
import home from './modules/home/index.entry'
import i18nDeco from './modules/decorators/i18n/index.entry'
import layout from './modules/layout/index.entry'
import layoutDeco from './modules/decorators/layout/index.entry'
import loading from './modules/loading/index.entry'
import localStoreDeco from './modules/decorators/localStore/index.entry'
import notFound from './modules/notFound/index.entry'
import noticeDeco from './modules/decorators/notice/index.entry'
import reduxProviderDeco from './modules/redux/provider/index.entry'
import reduxStoreDeco from './modules/redux/store/index.entry'
import reduxUtils from './modules/redux/utils/index.entry'
import themeDeco from './modules/decorators/theme/index.entry'
import utils from './modules/utils/index.entry'

const entry = (): RB.IRBModule => {
  return {
    antdIcon,
    app,
    constants,
    home,
    layout,
    loading,
    notFound,
    '@reduxProvider': reduxProviderDeco,
    '@reduxStore': reduxStoreDeco,
    reduxUtils,
    utils,
    '@i18n': i18nDeco,
    '@layout': layoutDeco,
    '@localStore': localStoreDeco,
    '@notice': noticeDeco,
    '@theme': themeDeco
  }
}

export default {
  entry
}
