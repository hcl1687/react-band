import PropTypes from 'prop-types'
import React from 'react'

const entry = () => {
  function App (props) {
    const { children } = props
    return <div className='app'>{children}</div>
  }

  App.propTypes = {
    children: PropTypes.any
  }

  return App
}

export default {
  entry
}
