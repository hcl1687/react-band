import React, { Component } from 'react'
import PropTypes from 'prop-types'
import lottie from 'lottie-web'

export default () => {
  return class Loading extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired
    }

    constructor (props, context) {
      super(props, context)

      this.lottieDom = React.createRef()
    }

    componentDidMount () {
      // wait 3s to show loading animate.
      setTimeout(() => {
        if (this.lottieDom && this.lottieDom.current) {
          lottie.loadAnimation({
            container: this.lottieDom.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie/Loading/data.json'
          })
        }
      }, 3000)
    }

    render () {
      const { __, theme } = this.props
      return <div className={theme.loading}>
        <div ref={this.lottieDom} className={theme.lottie} />
        <div className={theme.tip}>{__('loading')}</div>
      </div>
    }
  }
}
