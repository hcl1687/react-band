import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import queryString from 'query-string'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const Menu = await getModule('menu') as RB.IRBComponent
  const antd = await getModule('antd') as ANTD.IANTD
  const { Select, Button } = antd
  const { Option } = Select

  function Layout (props: InferProps<typeof Layout.propTypes>) {
    const { LEFT_STATUS, HEAD_STATUS, __, getNotification, children, notify } = props
    const theme = props.theme as RB.IRBTheme

    const handleTheme = (value: string) => {
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    const handleLocale = (value: string) => {
      const parsed = queryString.parse(location.search)
      parsed.locale = value
      location.search = queryString.stringify(parsed)
    }

    const handleToggleMenu = () => {
      notify('menu', 'toggleMenu')
    }

    const headDisplay = HEAD_STATUS ? 'block' : 'none'
    const leftDisplay = LEFT_STATUS ? 'block' : 'none'
    const parsed = queryString.parse(location.search)
    const themeName = parsed.theme || 'default'
    const locale = parsed.locale || 'en'

    return <div className={theme.layout}>
      <div className='header' style={{ display: headDisplay }}>
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
        <div className='left' style={{ display: leftDisplay }}>
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
    LEFT_STATUS: PropTypes.bool.isRequired,
    HEAD_STATUS: PropTypes.bool.isRequired,
    children: PropTypes.any,
    getNotification: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }

  return Layout
}
