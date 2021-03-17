import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import avatarFactory from './avatar'

export default async function (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBComponent> {
  const Avatar = await avatarFactory(RB_CONTEXT)

  function User (props: InferProps<typeof User.propTypes>) {
    const user = props.user as AsUtils.IUser
    const theme = props.theme as RB.IRBTheme
    const { userName, userType } = user

    return <div className={theme.user}>
      <Avatar user={user} className={theme.userAvatar} theme={theme} />
      <div className={theme.name}>
        {userName}
      </div>
      <div className={theme.description}>
        {userType}
      </div>
    </div>
  }

  User.propTypes = {
    theme: PropTypes.object.isRequired,
    user: PropTypes.object
  }

  User.defaultProps = {
    user: {}
  }

  return User
}
