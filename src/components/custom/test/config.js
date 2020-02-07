import localStore from './localStore'

export default (config) => {
  return {
    name: 'test',
    route: {
      path: '/test'
    },
    lazy: true,
    // auth: {},
    decoratorsConfig: {
      store: {
        menuStore: {
          actions: ['showMenu'],
          state: ['MENU_STATUS']
        }
      },
      localStore
    },
    decorators: ['i18n', 'theme', 'localStore', 'store', 'layout']
  }
}
