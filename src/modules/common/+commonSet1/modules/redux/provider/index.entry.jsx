import { Provider } from 'react-redux'
import React from 'react'
import getStore from '../getStore'

const entry = async ({ getModule }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (config, decoConfig, RB_CONTEXT) => async WrappedComponent => {
    const store = getStore()
    function reduxProviderDeco (props) {
      return <Provider store={store}>
        <WrappedComponent {...props} />
      </Provider>
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'reduxProviderDeco'))(reduxProviderDeco)
    }

    return reduxProviderDeco
  }
}

export default {
  entry
}
