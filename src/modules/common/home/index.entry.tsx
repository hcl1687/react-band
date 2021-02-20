import { IRBModule, IRBTheme } from '~/interface'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): IRBModule => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const { __ } = props
    const theme = props.theme as IRBTheme
    return <div className={theme.home}>{__('home')}</div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Home
}
