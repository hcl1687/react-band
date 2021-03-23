import IntlMessageFormat from 'intl-messageformat'
import React from 'react'

const entry = async ({ getModule, options }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  const { locale } = options

  return ({ i18n }) => WrappedComponent => {
    const __ = (key, values) => {
      if (!i18n[key]) {
        return key
      }
      return new IntlMessageFormat(i18n[key], locale).format(values)
    }

    function i18nDeco (props) {
      return <WrappedComponent {...props} __={__} />
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'i18nDeco'))(i18nDeco)
    }

    return i18nDeco
  }
}

export default {
  entry
}
