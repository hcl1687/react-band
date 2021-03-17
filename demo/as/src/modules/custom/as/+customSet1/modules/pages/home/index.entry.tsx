import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const { __ } = props
    const theme = props.theme as RB.IRBTheme

    let tip = __('home')
    if (process.env.NODE_ENV === 'production') {
      tip = __('jsonplaceholderTip')
    }

    return <div className={theme.home}>{tip}</div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Home
}
