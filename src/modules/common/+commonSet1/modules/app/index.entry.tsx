import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

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

export default {
  entry
}
