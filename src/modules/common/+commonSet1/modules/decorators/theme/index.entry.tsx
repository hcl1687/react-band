import React from 'react'

const entry = async ({ getModule }: RB.IRBContext): Promise<RB.IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  return ({ theme }: RB.IRBModuleConfig) => (WrappedComponent: RB.IRBComponent) => {
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
