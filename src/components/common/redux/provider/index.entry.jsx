import React, { Component } from 'react'
import { Provider } from 'react-redux'
import getStore from '../getStore'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (config, decoConfig, RB_CONTEXT) => async WrappedComponent => {
    const store = getStore()
    class reduxProviderDeco extends Component {
      render () {
        return <Provider store={store}>
          <WrappedComponent {...this.props} />
        </Provider>
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'reduxProviderDeco'))(reduxProviderDeco)
    }

    return reduxProviderDeco
  }
}
