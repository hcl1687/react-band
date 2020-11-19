import PropTypes from 'prop-types'
import React from 'react'

export default async function (RB_CONTEXT = {}) {
  const { getModule, options = {} } = RB_CONTEXT
  const { theme: themeType } = options
  const asUtils = await getModule('asUtils')
  const { getUrlByKey } = asUtils

  function User (props) {
    const handleError = (e) => {
      // e.target.src = this.getDefaultSrc()
    }

    const getDefaultSrc = () => {
      const { AUTH } = props
      const role = AUTH.role
      let src = 'img_Student.png'
      if (role === 'Teacher') {
        src = 'img_Teacher.png'
      }

      return `themes/${themeType}/${src}`
    }

    const { AUTH, theme } = props
    const { name, avatar } = AUTH
    const imgUrl = avatar ? getUrlByKey(avatar) : getDefaultSrc()

    return <div className={theme.user}>
      <img className={theme.avatar} src={imgUrl} onError={handleError} />
      <div className={theme.name}>
        {name}
      </div>
    </div>
  }

  User.propTypes = {
    theme: PropTypes.object.isRequired,
    AUTH: PropTypes.object
  }

  User.defaultProps = {
    AUTH: {}
  }

  return User
}
