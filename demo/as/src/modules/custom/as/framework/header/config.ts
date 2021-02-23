export default (): RB.IRBConfig => {
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
        },
        teacherStore: {
          state: ['teacher']
        }
      }
    },
    decorators: ['@notice', '@i18n', '@theme', '@reduxStore']
  }
}
