import * as antd from 'antd'

declare global {
  namespace ANTD {
    type IANTD = typeof antd
  }
}
