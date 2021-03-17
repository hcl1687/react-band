export default (): RB.IRBConfig => {
  return {
    name: 'loading',
    lazy: false,
    decorators: ['@i18n', '@theme']
  }
}
