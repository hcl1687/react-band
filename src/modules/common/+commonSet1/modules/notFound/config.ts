export default (): RB.IRBLeafConfig => {
  return {
    name: 'notFound',
    route: {
      path: undefined
    },
    decorators: ['@i18n', '@theme']
  }
}
