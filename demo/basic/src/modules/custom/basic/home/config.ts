export default (): RB.IRBLeafConfig => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
