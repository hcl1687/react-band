export default (config) => {
  return {
    name: 'menu',
    lazy: false,
    decoratorsConfig: {
      store: {
        menuStore: {
          state: ['MENU_STATUS']
        }
      }
    },
    decorators: ['i18n', 'theme', 'store']
  }
}
