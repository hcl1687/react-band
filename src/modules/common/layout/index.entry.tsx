import { IRBModule, IRBTheme } from '~/interface'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): IRBModule => {
  function Layout (props: InferProps<typeof Layout.propTypes>) {
    const { children } = props
    const theme = props.theme as IRBTheme
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
