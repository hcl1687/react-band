import { IRBComponent, IRBContext, IRBDecoModule } from '~/interface'
import { Provider } from 'react-redux'
import React from 'react'
import getStore from '../getStore'

export default async ({ getModule }: IRBContext): Promise<IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return () => async (WrappedComponent: IRBComponent) => {
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
