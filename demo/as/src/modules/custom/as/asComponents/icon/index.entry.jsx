import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1447108_jncuh5zb85a.js'
  ] // 阿里巴巴图标引用地址
})

export default (RB_CONTEXT) => {
  function AsICON (props) {
    const { mode, type, size, style, className, ...rest } = props
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

  AsICON.propTypes = {
    className: PropTypes.string,
    mode: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.any
  }

  AsICON.defaultProps = {
    className: '',
    type: '',
    mode: 'font' // font or symbol
  }

  return AsICON
}
