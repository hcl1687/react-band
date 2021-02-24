import localStore from './localStore'

export default (): RB.IRBLeafConfig => {
  return {
    name: 'demo/test',
    route: {
      path: '/test'
    },
    // auth: {},
    decoratorsConfig: {
      '@localStore': localStore
    },
    decorators: ['@i18n', '@theme', '@localStore', '@layout']
  }
}
