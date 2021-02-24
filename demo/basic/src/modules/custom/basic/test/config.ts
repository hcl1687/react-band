export default (): RB.IRBLeafConfig => {
  return {
    name: 'demo/default/test',
    route: {
      path: '/test'
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
