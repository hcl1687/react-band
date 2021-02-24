import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const handleClick = () => {
      const history = props.history as RB.IRBHistory
      history.push('/test')
    }

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
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
