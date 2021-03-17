import React from 'react'
import get from 'lodash/get'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (targetConfig: RB.IRBModuleConfig, decoConfig: RB.IRBModuleConfig) => async (WrappedComponent: RB.IRBComponent) => {
    const component = get(targetConfig, 'decoratorsConfig.@layout.component')
    const defaultComp = get(decoConfig, 'component')
    const Wrapper = (await getModule(component || defaultComp)) as RB.IRBComponent

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
