import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function Loading (props: InferProps<typeof Loading.propTypes>) {
    const { __ } = props
    const theme = props.theme as RB.IRBTheme
    return <div className={theme.loading}>{__('loading')}</div>
  }

  Loading.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Loading
}
