import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async function (RB_CONTEXT = {}) {
  const { getComponent } = RB_CONTEXT
  const asUtils = await getComponent('asUtils')
  const { getUrlByKey } = asUtils

  class User extends Component {
    static propTypes = {
      theme: PropTypes.object.isRequired,
      AUTH: PropTypes.object
    }

    static defaultProps = {
      AUTH: {}
    }

    handleError = (e) => {
      e.target.src = this.getDefaultSrc()
    }

    getDefaultSrc () {
      const { AUTH } = this.props
      const role = AUTH.role
      let src = 'img_Student.png'
      if (role === 'Teacher') {
        src = 'img_Teacher.png'
      }

      return src
    }

    render () {
      const { AUTH, theme } = this.props
      const { name, avatar } = AUTH
      const imgUrl = avatar ? getUrlByKey(avatar) : this.getDefaultSrc()

      return <div className={theme.user}>
        <img className={theme.avatar} src={imgUrl} onError={this.handleError} />
        <div className={theme.name}>
          {name}
        </div>
      </div>
    }
  }

  return User
}
