import { IRBLeafConfig } from '~/interface'

export default (): IRBLeafConfig => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    // auth: {},
    decorators: ['@i18n', '@theme', '@layout']
  }
}
