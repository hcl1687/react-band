import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

export default async ({ getComponent }) => {
  const Menu = await getComponent('menu')
  return class Layout extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      children: PropTypes.object.isRequired,
      getNotification: PropTypes.func.isRequired,
      notify: PropTypes.func.isRequired
    }

    handleTheme = (e) => {
      const value = (e.target.value || '').trim()
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    handleLocale = (e) => {
      const value = (e.target.value || '').trim()
      const parsed = queryString.parse(location.search)
      parsed.locale = value
      location.search = queryString.stringify(parsed)
    }

    handleToggleMenu = () => {
      const { notify } = this.props
      notify('menu', 'toggleMenu')
    }

    render () {
      const { theme, __, getNotification, children } = this.props
      const parsed = queryString.parse(location.search)
      const themeName = parsed.theme || 'default'
      const locale = parsed.locale || 'en'

      return <div className={theme.layout}>
        <div className='header'>
          <span>{__('head')}</span>
          <button onClick={this.handleToggleMenu}>{__('toggleMenu')}</button>
          <br />
          <span>{__('theme')}</span>
          <select value={themeName} onChange={this.handleTheme}>
            <option value='default'>{__('default')}</option>
            <option value='darkgray'>{__('darkgray')}</option>
          </select>
          <span>{__('locale')}</span>
          <select value={locale} onChange={this.handleLocale}>
            <option value='en'>{__('en')}</option>
            <option value='zh-CN'>{__('zh-CN')}</option>
          </select>
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
  }
}
