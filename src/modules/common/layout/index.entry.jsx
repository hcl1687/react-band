import PropTypes from 'prop-types'
import React from 'react'

export default () => {
  function Layout (props) {
    const { theme, children } = props
    return <div className={theme.layout}>
      {children}
    </div>
  }

  Layout.propTypes = {
    theme: PropTypes.object.isRequired,
    children: PropTypes.any
  }

  return Layout
}
