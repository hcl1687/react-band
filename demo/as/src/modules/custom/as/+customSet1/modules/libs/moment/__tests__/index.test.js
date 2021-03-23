import module from '../index.entry'

const lottieFactory = module.entry
const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'asUtils') {
      return {
        getRemoteComponent: (val) => (val)
      }
    }
  }
}

describe('custom/as/libs/moment', () => {
  it('should render correctly', async () => {
    const lottie = await lottieFactory(RB_CONTEXT)
    expect(lottie).toEqual({
      name: 'moment',
      libraryName: 'moment',
      externals: {},
      path: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/',
      entries: ['moment.min.js'],
      version: ''
    })
  })
})
