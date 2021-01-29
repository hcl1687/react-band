import PropTypes from 'prop-types'
import React from 'react'

export default () => {
  function Home (props) {
    const { __, theme } = props

    let tip = __('home')
    if (process.env.NODE_ENV === 'production') {
      tip = __('jsonplaceholderTip')
    }

    return <div className={theme.home}>{tip}</div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Home
}
