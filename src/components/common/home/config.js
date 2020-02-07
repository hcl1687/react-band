export default (config) => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    lazy: false,
    // auth: {},
    decorators: ['i18n', 'theme', 'layout']
  }
}
