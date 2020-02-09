import React, { Component } from 'react'
import get from 'lodash/get'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (targetConfig, decoConfig, RB_CONTEXT) => async WrappedComponent => {
    const component = get(targetConfig, 'decoratorsConfig.@layout.component')
    const defaultComp = get(decoConfig, 'component')
    const Wrapper = await getComponent(component || defaultComp)
    class layoutDeco extends Component {
      constructor (props, context) {
        super(props, context)
        this.state = {}
      }

      render () {
        return <Wrapper>
          <WrappedComponent {...this.props} />
        </Wrapper>
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'layoutDeco'))(layoutDeco)
    }

    return layoutDeco
  }
}
