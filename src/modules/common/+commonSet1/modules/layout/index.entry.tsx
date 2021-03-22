import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import defaultTheme from './themes/default/index.css'

const entry = (): RB.IRBComponent => {
  function Layout (props: InferProps<typeof Layout.propTypes>) {
    const { children } = props
    const theme = props.theme as RB.IRBTheme
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

const theme = (RB_CONTEXT: RB.IRBContext): RB.IRBTheme => {
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
