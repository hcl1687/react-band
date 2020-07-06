export default (config) => {
  return {
    name: 'demo/test',
    route: {
      path: '/test'
    },
    // auth: {},
    decoratorsConfig: {
      '@reduxStore': {
        assignmentStore: {
          actions: ['getList'],
          state: ['items', 'total']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore', '@layout']
  }
}
