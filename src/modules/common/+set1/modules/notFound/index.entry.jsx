import PropTypes from 'prop-types'
import React from 'react'

export default () => {
  function Test (props) {
    const { __, theme } = props
    return <div className={theme.notFound}>{__('notFound')}</div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Test
}
