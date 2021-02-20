import { IRBLeafConfig } from '~/interface'

export default (): IRBLeafConfig => {
  return {
    name: 'notFound',
    route: {
      path: undefined
    },
    decorators: ['@i18n', '@theme']
  }
}
