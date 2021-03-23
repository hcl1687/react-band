import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import queryString from 'query-string'
import zhCN from './i18n/zh-CN.json'

const entry = async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const Menu = await getModule('menu') as RB.IRBComponent
  function Layout (props: InferProps<typeof Layout.propTypes>) {
    const { __, getNotification, children, notify } = props
    const theme = props.theme as RB.IRBTheme

    const handleTheme = (e) => {
      const value = (e.target.value || '').trim()
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    const handleLocale = (e) => {
      const value = (e.target.value || '').trim()
      const parsed = queryString.parse(location.search)
      parsed.locale = value
      location.search = queryString.stringify(parsed)
    }

    const handleToggleMenu = () => {
      notify('menu', 'toggleMenu')
    }

    const parsed = queryString.parse(location.search)
    const themeName = parsed.theme || 'default'
    const locale = parsed.locale || 'en'

    return <div className={theme.layout}>
      <div className={theme.header}>
        <span>{__('head')}</span>
        <button onClick={handleToggleMenu}>{__('toggleMenu')}</button>
        <br />
        <span>{__('theme')}</span>
        <select value={themeName} onChange={handleTheme}>
          <option value='default'>{__('default')}</option>
          <option value='darkgray'>{__('darkgray')}</option>
        </select>
        <span>{__('locale')}</span>
        <select value={locale} onChange={handleLocale}>
          <option value='en'>{__('en')}</option>
          <option value='zh-CN'>{__('zh-CN')}</option>
        </select>
      </div>
      <div className={theme.content}>
        <div className={theme.left}>
          <Menu {...getNotification('menu')} />
        </div>
        <div className={theme.right}>
          {children}
        </div>
      </div>
    </div>
  }

  Layout.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    children: PropTypes.any,
    getNotification: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }

  return Layout
}

const i18n = (RB_CONTEXT: RB.IRBContext): RB.IRBI18n => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT: RB.IRBContext): RB.IRBTheme => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
