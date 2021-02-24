export default (): RB.IRBLeafConfig => {
  return {
    name: 'app',
    lazy: false,
    decorators: ['@antdProvider', '@reduxProvider']
  }
}
