import app from './modules/framework/app/index.entry'
import asConstants from './modules/asConstants/index.entry'
import asUtils from './modules/asUtils/index.entry'
import authStore from './modules/stores/auth/index.entry'
import breadcrumb from './modules/framework/breadcrumb/index.entry'
import breadcrumbStore from './modules/stores/breadcrumb/index.entry'
import header from './modules/framework/header/index.entry'
import home from './modules/pages/home/index.entry'
import layout from './modules/framework/layout/index.entry'
import layoutStore from './modules/stores/layout/index.entry'
import loading from './modules/framework/loading/index.entry'
import login from './modules/framework/login/index.entry'
import lottie from './modules/libs/lottie/index.entry'
import menu from './modules/framework/menu/index.entry'
import moment from './modules/libs/moment/index.entry'
import multiView from './modules/components/multiView/index.entry'
import profile from './modules/framework/profile/index.entry'
import teacherStore from './modules/stores/teacher/index.entry'

export default () => {
  return {
    asConstants,
    asUtils,
    multiView,
    app,
    breadcrumb,
    header,
    layout,
    loading,
    login,
    menu,
    profile,
    lottie,
    moment,
    home,
    authStore,
    breadcrumbStore,
    layoutStore,
    teacherStore
  }
}
