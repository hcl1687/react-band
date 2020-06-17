export default (config) => {
  return {
    name: 'demo/default/test',
    route: {
      path: '/test'
    },
    // auth: {},
    decorators: ['@i18n', '@theme', '@layout']
  }
}
