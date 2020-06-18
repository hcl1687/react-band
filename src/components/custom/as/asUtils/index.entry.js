export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const asConstants = await getComponent('asConstants')
  const { ENV } = asConstants

  function getUrlByKey (key = '', type = '') {
    if (!key) {
      return key
    }

    if (/^(http:\/\/|https:\/\/)/.test(key)) {
      return key
    }

    // 'cudos/images/xxx.png' or '/cudos/images/xxx.png'
    if (/^\/?cudos\//.test(key)) {
      // covert 'cudos/images/xxx.png' to '/cudos/images/xxx.png'
      if (key[0] !== '/') {
        key = '/' + key
      }
      return `${ENV.MEDIA_URL}${key}`
    }

    return `${ENV.MEDIA_URL}${type}${key}`
  }

  return {
    getUrlByKey
  }
}
