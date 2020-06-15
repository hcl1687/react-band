export default (config) => {
  return {
    name: 'demo/test',
    // disabled: true,
    route: {
      path: '/test'
    },
    // auth: {},
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          actions: ['showLeft'],
          state: ['LEFT_STATUS']
        },
        itemStore: {
          actions: ['addItem', 'deleteItem'],
          state: ['items']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore', '@layout']
  }
}
