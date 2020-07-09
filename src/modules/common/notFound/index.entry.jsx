import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class Test extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired
    }

    render () {
      const { __, theme } = this.props
      return <div className={theme.notFound}>{__('notFound')}</div>
    }
  }
}
