import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import classnames from 'classnames'

export default async function (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBComponent> {
  const { getModule, options } = RB_CONTEXT
  const { theme: themeType } = options
  const asUtils = await getModule('asUtils')
  const { getUrlByKey } = asUtils as AsUtils.IUtils

  function Avatar (props: InferProps<typeof Avatar.propTypes>) {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement
      target.src = getDefaultSrc()
    }

    const getDefaultSrc = () => {
      const user = props.user as AsUtils.IUser
      const role = user.userType
      let src = 'img_Student.png'
      if (role === 'Teacher') {
        src = 'img_Teacher.png'
      }

      return `themes/${themeType}/${src}`
    }

    const { className } = props
    const theme = props.theme as RB.IRBTheme
    const user = props.user as AsUtils.IUser
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
