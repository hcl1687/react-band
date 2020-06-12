import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async ({ getComponent }) => {
  return class Test extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    }

    handleClick = (e) => {
      const { history } = this.props
      history.push('/')
    }

    render () {
      const { __, theme } = this.props
      return <div className={theme.test}>
        <div>{__('test')}</div>
        <button onClick={this.handleClick} >{__('toHome')}</button>
      </div>
    }
  }
}