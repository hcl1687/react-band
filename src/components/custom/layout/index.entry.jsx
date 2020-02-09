import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

export default async ({ getComponent }) => {
  const Menu = await getComponent('menu')
  return class Layout extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      LEFT_STATUS: PropTypes.bool.isRequired,
      HEAD_STATUS: PropTypes.bool.isRequired,
      children: PropTypes.object.isRequired
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

    render () {
      const { LEFT_STATUS, HEAD_STATUS, theme, __, children } = this.props
      const headDisplay = HEAD_STATUS ? 'block' : 'none'
      const leftDisplay = LEFT_STATUS ? 'block' : 'none'
      const parsed = queryString.parse(location.search)
      const themeName = parsed.theme || 'default'
      const locale = parsed.locale || 'en'

      return <div className={theme.layout}>
        <div className='header' style={{ display: headDisplay }}>
          <span>{__('head')}</span><br />
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
          <div className='left' style={{ display: leftDisplay }}>
            <Menu />
          </div>
          <div className='right'>
            {children}
          </div>
        </div>
      </div>
    }
  }
}
