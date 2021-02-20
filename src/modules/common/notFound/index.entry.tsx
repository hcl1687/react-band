import { IRBModule, IRBTheme } from '~/interface'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): IRBModule => {
  function Test (props: InferProps<typeof Test.propTypes>) {
    const { __ } = props
    const theme = props.theme as IRBTheme
    return <div className={theme.notFound}>{__('notFound')}</div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Test
}
