export default (): RB.IRBConfig => {
  return {
    name: 'app',
    lazy: false,
    decorators: ['@antdProvider', '@reduxProvider']
  }
}
