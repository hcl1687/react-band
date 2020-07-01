import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class App extends Component {
    static propTypes = {
      children: PropTypes.any
    }

    render () {
      const { children } = this.props
      return <div className='app'>{children}</div>
    }
  }
}
