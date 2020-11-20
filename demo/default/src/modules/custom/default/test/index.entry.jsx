import PropTypes from 'prop-types'
import React from 'react'

export default async ({ getModule }) => {
  function Test (props) {
    const { __, theme } = props
    return <div className={theme.test}>
      {__('test')}
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Test
}
