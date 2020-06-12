export default (config) => {
  return {
    name: 'demo/default/test',
    disabled: true,
    route: {
      path: '/test'
    },
    lazy: true,
    // auth: {},
    decorators: ['@i18n', '@theme', '@layout']
  }
}
