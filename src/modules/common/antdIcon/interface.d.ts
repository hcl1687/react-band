import * as antdIcon from '@ant-design/icons'

declare global {
  namespace AntdIcon {
    type IAntdIcon = typeof antdIcon
  }
}
