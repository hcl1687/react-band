import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'

export default async function (RB_CONTEXT) {
  const { getModule, options } = RB_CONTEXT
  const { theme: themeType } = options
  const asUtils = await getModule('asUtils')
  const { getUrlByKey } = asUtils

  function Avatar (props) {
    const handleError = (e) => {
      e.target.src = getDefaultSrc()
    }

    const getDefaultSrc = () => {
      const { user } = props
      const role = user.userType
      let src = 'img_Student.png'
      if (role === 'Teacher') {
        src = 'img_Teacher.png'
      }

      return `themes/${themeType}/${src}`
    }

    const { user, theme, className } = props
    const { avatar } = user
    const imgUrl = avatar ? getUrlByKey(avatar) : getDefaultSrc()
    const cName = classnames(className, theme.avatar)

    return <img className={cName} src={imgUrl} onError={handleError} />
  }

  Avatar.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.object.isRequired,
    user: PropTypes.object
  }

  Avatar.defaultProps = {
    className: '',
    user: {}
  }

  return Avatar
}
