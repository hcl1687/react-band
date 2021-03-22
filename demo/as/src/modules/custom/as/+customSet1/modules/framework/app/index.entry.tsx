import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'

const entry = (): RB.IRBComponent => {
  function App (props: InferProps<typeof App.propTypes>) {
    const { children } = props
    return <div className='app'>{children}</div>
  }

  App.propTypes = {
    children: PropTypes.any
  }

  return App
}

const theme = (RB_CONTEXT: RB.IRBContext): RB.IRBTheme => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  theme
}
