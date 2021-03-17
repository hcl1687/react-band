export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBModule> => {
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
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
