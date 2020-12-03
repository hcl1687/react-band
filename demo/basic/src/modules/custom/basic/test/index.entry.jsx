import PropTypes from 'prop-types'
import React from 'react'

export default async (RB_CONTEXT) => {
  function Test (props) {
    const handleClick = (e) => {
      const { history } = props
      history.push('/')
    }

    const { __, theme } = props
    return <div className={theme.test}>
      <div className={theme.content}>{__('test')}</div>
      <button onClick={handleClick} >{__('toHome')}</button>
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Test
}
