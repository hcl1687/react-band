import { IRBLeafConfig } from '~/interface'

export default (): IRBLeafConfig => {
  return {
    name: 'layout',
    decorators: ['@i18n', '@theme']
  }
}
