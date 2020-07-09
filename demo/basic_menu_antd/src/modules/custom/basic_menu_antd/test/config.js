import localStore from './localStore'

export default (config) => {
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
