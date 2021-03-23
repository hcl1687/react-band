import React from 'react'
import get from 'lodash/get'

const entry = async ({ getModule }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (targetConfig, decoConfig, RB_CONTEXT) => async WrappedComponent => {
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

export default {
  entry
}
