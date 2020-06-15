export default (config) => {
  return {
    name: 'demo/default/test',
    disabled: true,
    route: {
      path: '/test'
    },
    // auth: {},
    decorators: ['@i18n', '@theme', '@layout']
  }
}
