import PropTypes from 'prop-types'
import React from 'react'

export default () => {
  function Loading (props) {
    const { __, theme } = props
    return <div className={theme.loading}>{__('loading')}</div>
  }

  Loading.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Loading
}
