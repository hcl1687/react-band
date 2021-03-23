const LOCAL_STORAGE_PREFIX = 'AS_'
const ASSETS_PREFIX = {
  image: '/cudos/activity/images/',
  sound: '/cudos/activity/sounds/',
  video: '/cudos/activity/videos/',
  document: '/cudos/activity/documents/',
  imageList: '/cudos/activity/images/'
}

const entry = (): RB.IRBModule => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const ENV: AsConstants.IENV = require(`./env/${process.env.RB_ENV}`)
  return {
    LOCAL_STORAGE_PREFIX,
    ASSETS_PREFIX,
    ENV
  }
}

export default {
  entry
}
