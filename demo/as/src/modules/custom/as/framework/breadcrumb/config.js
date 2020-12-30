export default () => {
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
