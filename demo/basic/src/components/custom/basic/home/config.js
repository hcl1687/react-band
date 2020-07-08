export default (config) => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
