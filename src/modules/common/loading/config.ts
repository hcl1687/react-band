import { IRBLeafConfig } from '~/interface'

export default (): IRBLeafConfig => {
  return {
    name: 'loading',
    lazy: false,
    decorators: ['@i18n', '@theme']
  }
}
