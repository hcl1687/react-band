import antd from './modules/antd/components/index.entry'
import antdProviderDeco from './modules/antd/decorators/provider/index.entry'

const entry = (): RB.IRBModule => {
  return {
    antd,
    '@antdProvider': antdProviderDeco
  }
}

export default {
  entry
}
