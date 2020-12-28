import PropTypes from 'prop-types'
import React from 'react'
import avatarFactory from './avatar'

export default async function (RB_CONTEXT = {}) {
  const Avatar = await avatarFactory(RB_CONTEXT)

  function User (props) {
    const { AUTH, theme } = props
    const { name, userType } = AUTH

    return <div className={theme.user}>
      <Avatar AUTH={AUTH} className={theme.userAvatar} theme={theme} />
      <div className={theme.name}>
        {name}
      </div>
      <div className={theme.description}>
        {userType}
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
