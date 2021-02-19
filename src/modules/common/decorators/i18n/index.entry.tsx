import { IRBComponent, IRBContext, IRBDecoModule, IRBModuleConfig } from '~/interface'
import IntlMessageFormat from 'intl-messageformat'
import React from 'react'

export default async ({ getModule, options }: IRBContext): Promise<IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils
  const { locale } = options

  return ({ i18n }: IRBModuleConfig) => (WrappedComponent: IRBComponent) => {
    const __ = (key: string, values: Record<string, PrimitiveType>) => {
      if (!i18n[key]) {
        return key
      }
      return new IntlMessageFormat(i18n[key], locale).format(values)
    }

    function i18nDeco (props) {
      return <WrappedComponent {...props} __={__} />
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'i18nDeco'))(i18nDeco)
    }

    return i18nDeco
  }
}
