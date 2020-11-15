import PropTypes from 'prop-types'
import React from 'react'

export default () => {
  function Home (props) {
    const { __, theme } = props
    return <div className={theme.home}>{__('home')}</div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Home
}
