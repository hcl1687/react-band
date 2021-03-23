import PropTypes from 'prop-types'
import React from 'react'
import defaultTheme from './themes/default/index.css'

const entry = () => {
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

const theme = (RB_CONTEXT) => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  theme
}
