export default (): RB.IRBConfig => {
  return {
    name: 'breadcrumb',
    decoratorsConfig: {
      '@reduxStore': {
        breadcrumbStore: {
          state: ['BREADCRUMBS']
        }
      }
    },
    decorators: ['@theme', '@reduxStore']
  }
}
