import React, { Component } from 'react'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (targetConfig, decoConfig, RB_CONTEXT) => WrappedComponent => {
    const { theme = {} } = decoConfig
    class layoutDeco extends Component {
      constructor (props, context) {
        super(props, context)
        this.state = {}
      }

      render () {
        return <div className={theme.layout}>
          <WrappedComponent {...this.props} />
        </div>
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'layoutDeco'))(layoutDeco)
    }

    return layoutDeco
  }
}
