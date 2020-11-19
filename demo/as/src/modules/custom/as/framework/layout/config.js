export default () => {
  return {
    name: 'layout',
    decoratorsConfig: {
      '@reduxStore': {
        layoutStore: {
          state: ['LEFT_STATUS', 'HEAD_STATUS']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore']
  }
}
