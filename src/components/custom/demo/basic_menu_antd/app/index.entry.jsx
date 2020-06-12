import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class App extends Component {
    static propTypes = {
      children: PropTypes.object.isRequired
    }

    render () {
      const { children } = this.props
      return <div className='app'>{children}</div>
    }
  }
}
