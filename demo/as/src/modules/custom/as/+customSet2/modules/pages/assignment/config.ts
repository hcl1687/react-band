export default (): RB.IRBLeafConfig => {
  return {
    name: 'assignment',
    route: {
      path: '/assignment'
    },
    // auth: {},
    decoratorsConfig: {
      '@reduxStore': {
        assignmentStore: {
          actions: ['getAssignmentList'],
          state: ['assignments', 'total']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore', '@layout']
  }
}
