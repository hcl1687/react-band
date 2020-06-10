import localStore from './localStore'

export default (config) => {
  return {
    name: 'demo/test',
    // disabled: true,
    route: {
      path: '/test'
    },
    lazy: true,
    // auth: {},
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          actions: ['showLeft'],
          state: ['LEFT_STATUS']
        }
      },
      '@localStore': localStore
    },
    decorators: ['@i18n', '@theme', '@localStore', '@reduxStore', '@layout']
  }
}
