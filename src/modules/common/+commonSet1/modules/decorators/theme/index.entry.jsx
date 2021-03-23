import React from 'react'

const entry = async ({ getModule }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  return ({ theme }) => WrappedComponent => {
    function themeDeco (props) {
      return <WrappedComponent {...props} theme={theme} />
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'themeDeco'))(themeDeco)
    }

    return themeDeco
  }
}

export default {
  entry
}
