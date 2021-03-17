export default (): RB.IRBLeafConfig => {
  return {
    name: 'assignmentDetail',
    decoratorsConfig: {
      '@reduxStore': {
        assignmentStore: {
          actions: ['getAssignment', 'editAssignment'],
          state: ['assignment']
        },
        breadcrumbStore: {
          actions: ['setBreadcrumb']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore']
  }
}
