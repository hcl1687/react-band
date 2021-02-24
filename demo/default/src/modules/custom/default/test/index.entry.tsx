import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default async (): Promise<RB.IRBComponent> => {
  function Test (props: InferProps<typeof Test.propTypes>) {
    const { __ } = props
    const theme = props.theme as RB.IRBTheme
    return <div className={theme.test}>
      {__('test')}
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Test
}
