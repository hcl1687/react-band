import { IRBComponent, IRBContext, IRBDecoModule, IRBModuleConfig } from '~/interface'
import React from 'react'

export default async ({ getModule }: IRBContext): Promise<IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  return ({ theme }: IRBModuleConfig) => (WrappedComponent: IRBComponent) => {
    function themeDeco (props) {
      return <WrappedComponent {...props} theme={theme} />
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'themeDeco'))(themeDeco)
    }

    return themeDeco
  }
}
