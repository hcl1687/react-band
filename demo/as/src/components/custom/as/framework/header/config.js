export default (config) => {
  return {
    name: 'header',
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          actions: ['showLeft'],
          state: ['LEFT_STATUS']
        },
        authStore: {
          state: ['AUTH'],
          actions: ['logout']
        }
      }
    },
    decorators: ['@notice', '@i18n', '@theme', '@reduxStore']
  }
}
