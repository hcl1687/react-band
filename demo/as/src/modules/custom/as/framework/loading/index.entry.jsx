import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const lottie = await getModule('lottie')

  function Loading (props) {
    const lottieDom = useRef(null)

    useEffect(() => {
      // wait 3s to show loading animate.
      setTimeout(() => {
        if (lottieDom && lottieDom.current) {
          lottie.loadAnimation({
            container: lottieDom.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie/Loading/data.json'
          })
        }
      }, 3000)
    }, [])

    const { __, theme } = props
    return <div className={theme.loading}>
      <div ref={lottieDom} className={theme.lottie} />
      <div className={theme.tip}>{__('loading')}</div>
    </div>
  }

  Loading.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Loading
}
