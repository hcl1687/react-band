import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import queryString from 'query-string'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
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
