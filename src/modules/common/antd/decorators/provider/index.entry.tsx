import { IRBComponent, IRBContext, IRBDecoModule } from '~/interface'
import React, { Component } from 'react'
import { ConfigProvider } from 'antd'
import { Locale } from 'antd/lib/locale-provider'
import get from 'lodash/get'

export default async ({ getModule }: IRBContext): Promise<IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return (config, decoConfig, RB_CONTEXT: IRBContext) => async (WrappedComponent: IRBComponent) => {
    // eslint-disable-next-line
    await getModule('antd') || {}
    const { options: { locale }, i18ns } = RB_CONTEXT
    const i18n = (get(i18ns, `antd.${locale}`) as unknown) as Locale
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