import PropTypes from 'prop-types'
import React from 'react'

export default (RB_CONTEXT) => {
  function Home (props) {
    const handleClick = () => {
      const { history } = props
      history.push('/test')
    }

    const { __, theme } = props
    return <div className={theme.home}>
      <div className={theme.content}>{__('home')}</div>
      <button onClick={handleClick}>{__('toTest')}</button>
    </div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Home
}
