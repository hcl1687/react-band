export default () => {
  return {
    name: 'login',
    decoratorsConfig: {
      '@reduxStore': {
        authStore: {
          state: ['AUTH'],
          actions: ['login']
        }
      }
    },
    decorators: ['@notice', '@i18n', '@theme', '@reduxStore']
  }
}
