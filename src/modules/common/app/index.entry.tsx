import { IRBModule } from '~/interface'
import PropTypes from 'prop-types'
import React from 'react'

export default (): IRBModule => {
  function App (props) {
    const { children } = props
    return <div className='app'>{children}</div>
  }

  App.propTypes = {
    children: PropTypes.any
  }

  return App
}
