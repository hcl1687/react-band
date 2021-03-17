export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBModule> => {
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
  const { getRemoteComponent } = asUtils

  const componentInfo = {
    name: 'moment',
    libraryName: 'moment',
    externals: {},
    path: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/',
    entries: ['moment.min.js'],
    version: ''
  }

  const moment = await getRemoteComponent(componentInfo, {})
  return moment
}
