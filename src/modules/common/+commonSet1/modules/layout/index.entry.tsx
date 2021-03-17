import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
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
