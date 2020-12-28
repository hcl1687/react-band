import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'

export default async function (RB_CONTEXT = {}) {
  const { getModule, options = {} } = RB_CONTEXT
  const { theme: themeType } = options
  const asUtils = await getModule('asUtils')
  const { getUrlByKey } = asUtils

  function Avatar (props) {
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

    const { AUTH, theme, className } = props
    const { avatar } = AUTH
    const imgUrl = avatar ? getUrlByKey(avatar) : getDefaultSrc()
    const cName = classnames(className, theme.avatar)

    return <img className={cName} src={imgUrl} onError={handleError} />
  }

  Avatar.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.object.isRequired,
    AUTH: PropTypes.object
  }

  Avatar.defaultProps = {
    className: '',
    AUTH: {}
  }

  return Avatar
}
