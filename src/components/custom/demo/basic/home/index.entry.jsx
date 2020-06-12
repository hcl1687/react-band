import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class Home extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      history: PropTypes.object.isRequired
    }

    handleClick = () => {
      const { history } = this.props
      history.push('/test')
    }

    render () {
      const { __ } = this.props
      return <div>
        <div>{__('home')}</div>
        <button onClick={this.handleClick}>{__('toTest')}</button>
      </div>
    }
  }
}
