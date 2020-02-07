import React, { Component } from 'react'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return ({ i18n }) => WrappedComponent => {
    class i18nDeco extends Component {
      __ = (key) => {
        return i18n[key]
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
