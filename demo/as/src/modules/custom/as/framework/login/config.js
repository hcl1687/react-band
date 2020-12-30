export default () => {
  return {
    name: 'login',
    decoratorsConfig: {
      '@reduxStore': {
        authStore: {
          state: ['AUTH'],
          actions: ['login']
        },
        teacherStore: {
          state: ['teacher'],
          actions: ['getTeacher']
        }
      }
    },
    decorators: ['@notice', '@i18n', '@theme', '@reduxStore']
  }
}
