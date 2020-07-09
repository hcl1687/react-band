import React, { Component } from 'react'

export default async ({ getModule }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  return ({ theme }) => WrappedComponent => {
    class themeDeco extends Component {
      render () {
        return <WrappedComponent {...this.props} theme={theme} />
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'themeDeco'))(themeDeco)
    }

    return themeDeco
  }
}
