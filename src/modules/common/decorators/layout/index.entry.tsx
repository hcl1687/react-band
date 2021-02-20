import { IRBComponent, IRBContext, IRBDecoModule, IRBModuleConfig } from '~/interface'
import React from 'react'
import get from 'lodash/get'

export default async ({ getModule }: IRBContext): Promise<IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (targetConfig: IRBModuleConfig, decoConfig: IRBModuleConfig) => async (WrappedComponent: IRBComponent) => {
    const component = get(targetConfig, 'decoratorsConfig.@layout.component')
    const defaultComp = get(decoConfig, 'component')
    const Wrapper = await getModule(component || defaultComp)

    function layoutDeco (props) {
      return <Wrapper>
        <WrappedComponent {...props} />
      </Wrapper>
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'layoutDeco'))(layoutDeco)
    }

    return layoutDeco
  }
}
