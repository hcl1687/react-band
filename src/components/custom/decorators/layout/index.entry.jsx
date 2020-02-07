import React, { Component } from 'react'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const Menu = await getComponent('menu') || null
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
          <div className='header'>head</div>
          <div className='content'>
            <div className='left'>
              <Menu {...this.props} />
            </div>
            <div className='right'>
              <WrappedComponent {...this.props} />
            </div>
          </div>
        </div>
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'layoutDeco'))(layoutDeco)
    }

    return layoutDeco
  }
}
