export default (): RB.IRBLeafConfig => {
  return {
    name: 'profile',
    decoratorsConfig: {
      '@reduxStore': {
        authStore: {
          state: ['AUTH']
        },
        teacherStore: {
          state: ['teacher'],
          actions: ['getTeacher', 'editTeacher']
        }
      }
    },
    decorators: ['@notice', '@i18n', '@theme', '@reduxStore']
  }
}
