import React, { Component } from 'react'
import { ConfigProvider } from 'antd'
import get from 'lodash/get'

const entry = async ({ getModule }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (config, decoConfig, RB_CONTEXT) => async WrappedComponent => {
    // eslint-disable-next-line
    await getModule('antd') || {}
    const { options: { locale }, i18ns } = RB_CONTEXT
    const i18n = get(i18ns, `antd.${locale}`)
    class antdProviderDeco extends Component {
      render () {
        return <ConfigProvider locale={i18n}>
          <WrappedComponent {...this.props} />
        </ConfigProvider>
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'antdProviderDeco'))(antdProviderDeco)
    }

    return antdProviderDeco
  }
}

export default {
  entry
}
