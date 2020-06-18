import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const antd = await getComponent('antd')
  const { Icon } = antd
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1447108_jncuh5zb85a.js' // 阿里巴巴图标引用地址
  })

  return class AsICON extends Component {
    static propTypes = {
      className: PropTypes.string,
      mode: PropTypes.string,
      type: PropTypes.string,
      size: PropTypes.number,
      style: PropTypes.any
    }

    static defaultProps = {
      className: '',
      type: '',
      mode: 'font' // font or symbol
    }

    render () {
      const { mode, type, size, style, className, ...rest } = this.props
      const newStyle = style || {}
      if (size) {
        newStyle.fontSize = `${size}px`
      }
      let newType = type
      if (newType) {
        newType = newType.indexOf('iconicon_') === 0 ? newType : `iconicon_${newType}`
      }

      return mode === 'font' ? <i className={classnames('iconfont', newType, className)}
        style={newStyle} {...rest} />
        : <IconFont type={newType} style={newStyle} className={className} {...rest} />
    }
  }
}
