import antd from './modules/antd/components/index.entry'
import antdProviderDeco from './modules/antd/decorators/provider/index.entry'

export default () => {
  return {
    antd,
    '@antdProvider': antdProviderDeco
  }
}
