export default (): RB.IRBLeafConfig => {
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
