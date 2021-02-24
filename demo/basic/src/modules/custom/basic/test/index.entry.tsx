import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default async (): Promise<RB.IRBComponent> => {
  function Test (props: InferProps<typeof Test.propTypes>) {
    const handleClick = () => {
      const history = props.history as RB.IRBHistory
      history.push('/')
    }

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
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
