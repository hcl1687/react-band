import PropTypes from 'prop-types'
import React from 'react'
import queryString from 'query-string'

export default async ({ getModule }) => {
  const Menu = await getModule('menu')
  const antd = await getModule('antd')
  const { Select, Button } = antd
  const { Option } = Select

  function Layout (props) {
    const { theme, __, getNotification, children, notify } = props
    const handleTheme = (value) => {
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    const handleLocale = (value) => {
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
      <div className='header'>
        <span>{__('head')}</span>
        <Button onClick={handleToggleMenu}>{__('toggleMenu')}</Button>
        <br />
        <span>{__('theme')}</span>
        <Select value={themeName} onChange={handleTheme}>
          <Option value='default'>{__('default')}</Option>
          <Option value='darkgray'>{__('darkgray')}</Option>
        </Select>
        <span>{__('locale')}</span>
        <Select value={locale} onChange={handleLocale}>
          <Option value='en'>{__('en')}</Option>
          <Option value='zh-CN'>{__('zh-CN')}</Option>
        </Select>
      </div>
      <div className='content'>
        <div className='left'>
          <Menu {...getNotification('menu')} />
        </div>
        <div className='right'>
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
