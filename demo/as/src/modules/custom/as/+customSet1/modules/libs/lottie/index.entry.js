const entry = async ({ getModule }) => {
  const asUtils = await getModule('asUtils')
  const { getRemoteComponent } = asUtils

  const componentInfo = {
    name: 'lottie',
    libraryName: 'lottie',
    externals: {},
    path: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.5/',
    entries: ['lottie.min.js'],
    version: ''
  }

  const lottie = await getRemoteComponent(componentInfo, {})
  return lottie
}

export default {
  entry
}
