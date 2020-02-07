import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class Test extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired
    }

    render () {
      const { __ } = this.props
      return <div>{__('notFound')}</div>
    }
  }
}
