import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

export default async ({ getComponent }) => {
  const Menu = await getComponent('menu')
  const antd = await getComponent('antd')
  const { Select, Button } = antd
  const { Option } = Select
  return class Layout extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      children: PropTypes.any,
      getNotification: PropTypes.func.isRequired,
      notify: PropTypes.func.isRequired
    }

    handleTheme = (value) => {
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    handleLocale = (value) => {
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
          <Button onClick={this.handleToggleMenu}>{__('toggleMenu')}</Button>
          <br />
          <span>{__('theme')}</span>
          <Select value={themeName} onChange={this.handleTheme}>
            <Option value='default'>{__('default')}</Option>
            <Option value='darkgray'>{__('darkgray')}</Option>
          </Select>
          <span>{__('locale')}</span>
          <Select value={locale} onChange={this.handleLocale}>
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
  }
}
