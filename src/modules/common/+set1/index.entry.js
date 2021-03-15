import antd from './modules/antd/components/index.entry'
import antdIcon from './modules/antdIcon/index.entry'
import antdProviderDeco from './modules/antd/decorators/provider/index.entry'
import app from './modules/app/index.entry'
import constants from './modules/constants/index.entry'
import home from './modules/home/index.entry'
import layout from './modules/layout/index.entry'
import loading from './modules/loading/index.entry'
import notFound from './modules/notFound/index.entry'
import reduxProviderDeco from './modules/redux/provider/index.entry'
import reduxStoreDeco from './modules/redux/store/index.entry'
import reduxUtils from './modules/redux/utils/index.entry'
import utils from './modules/utils/index.entry'

export default () => {
  return {
    antd,
    '@antdProvider': antdProviderDeco,
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
    utils
  }
}
