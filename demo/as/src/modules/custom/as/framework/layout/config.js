export default () => {
  return {
    name: 'layout',
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          actions: ['showLeft'],
          state: ['LEFT_STATUS', 'LAYOUT_MODE']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore']
  }
}
