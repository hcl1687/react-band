export default (config) => {
  return {
    name: 'header',
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          actions: ['showLeft'],
          state: ['LEFT_STATUS']
        }
      }
    },
    decorators: ['@notice', '@i18n', '@theme', '@reduxStore']
  }
}
