import React, { Component } from 'react'
import IntlMessageFormat from 'intl-messageformat'

export default async ({ getModule, options }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  const { locale } = options

  return ({ i18n }) => WrappedComponent => {
    class i18nDeco extends Component {
      __ = (key, values) => {
        if (!i18n[key]) {
          return key
        }
        return new IntlMessageFormat(i18n[key], locale).format(values)
      }

      render () {
        return <WrappedComponent {...this.props} __={this.__} />
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'i18nDeco'))(i18nDeco)
    }

    return i18nDeco
  }
}
