import localStore from './localStore'

export default (config) => {
  return {
    name: 'demo/test',
    route: {
      path: '/test'
    },
    lazy: true,
    // auth: {},
    decoratorsConfig: {
      '@store': {
        layoutStore: {
          actions: ['showLeft'],
          state: ['LEFT_STATUS']
        }
      },
      '@localStore': localStore
    },
    decorators: ['@i18n', '@theme', '@localStore', '@store', '@layout']
  }
}
