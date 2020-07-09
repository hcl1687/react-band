import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default (RB_CONTEXT) => {
  return class Home extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    }

    handleClick = () => {
      const { history } = this.props
      history.push('/test')
    }

    render () {
      const { __, theme } = this.props
      return <div className={theme.home}>
        <div className={theme.content}>{__('home')}</div>
        <button onClick={this.handleClick}>{__('toTest')}</button>
      </div>
    }
  }
}
