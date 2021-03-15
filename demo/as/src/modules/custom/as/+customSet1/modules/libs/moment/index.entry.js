export default async ({ getModule }) => {
  const asUtils = await getModule('asUtils')
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
