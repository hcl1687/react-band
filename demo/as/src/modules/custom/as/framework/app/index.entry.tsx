import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function App (props: InferProps<typeof App.propTypes>) {
    const { children } = props
    return <div className='app'>{children}</div>
  }

  App.propTypes = {
    children: PropTypes.any
  }

  return App
}
