import PropTypes from 'prop-types'
import React from 'react'

export default () => {
  function App (props) {
    const { children } = props
    return <div className='app'>{children}</div>
  }

  App.propTypes = {
    children: PropTypes.any
  }

  return App
}
