export default (config) => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    // auth: {},
    decorators: ['@i18n', '@theme', '@layout']
  }
}
