export default (config) => {
  return {
    name: 'notFound',
    lazy: false,
    route: {
      path: undefined
    },
    decorators: ['@i18n', '@theme']
  }
}
