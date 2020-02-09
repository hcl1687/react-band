export default () => {
  return {
    name: 'layout',
    decoratorsConfig: {
      '@store': {
        layoutStore: {
          state: ['LEFT_STATUS', 'HEAD_STATUS']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@store']
  }
}
