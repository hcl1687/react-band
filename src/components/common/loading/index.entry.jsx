import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class Loading extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired
    }

    render () {
      const { __ } = this.props
      return <div>{__('loading')}</div>
    }
  }
}
