export default (config) => {
  return {
    name: 'header',
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          actions: ['showLeft', 'setLayout'],
          state: ['LEFT_STATUS', 'LAYOUT_MODE']
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
