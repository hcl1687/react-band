import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class Layout extends Component {
    static propTypes = {
      theme: PropTypes.object.isRequired,
      children: PropTypes.any
    }

    render () {
      const { theme, children } = this.props
      return <div className={theme.layout}>
        {children}
      </div>
    }
  }
}
