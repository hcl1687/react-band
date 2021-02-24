import PropTypes, { InferProps } from 'prop-types'
import React, { useEffect, useRef } from 'react'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const lottie = await getModule('lottie') as Lottie.ILottie

  function Loading (props: InferProps<typeof Loading.propTypes>) {
    const lottieDom = useRef(null)

    useEffect(() => {
      // wait 100ms to show loading animate.
      setTimeout(() => {
        if (lottieDom && lottieDom.current) {
          lottie.loadAnimation({
            container: lottieDom.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './lottie/Loading/data.json'
          })
        }
      }, 100)
    }, [])

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
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
