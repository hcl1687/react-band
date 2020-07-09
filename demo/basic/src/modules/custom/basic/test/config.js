export default (config) => {
  return {
    name: 'demo/default/test',
    route: {
      path: '/test'
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
