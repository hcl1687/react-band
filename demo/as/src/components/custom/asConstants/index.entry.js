const ENV = require(`./env/${process.env.RB_ENV}`)
const LOCAL_STORAGE_PREFIX = 'AS_'
const ASSETS_PREFIX = {
  image: '/cudos/activity/images/',
  sound: '/cudos/activity/sounds/',
  video: '/cudos/activity/videos/',
  document: '/cudos/activity/documents/',
  imageList: '/cudos/activity/images/'
}

export default (RB_CONTEXT) => {
  return {
    LOCAL_STORAGE_PREFIX,
    ASSETS_PREFIX,
    ENV
  }
}
