export default (): RB.IRBLeafConfig => {
  return {
    name: 'loading',
    lazy: false,
    decorators: ['@i18n', '@theme']
  }
}
