import lottieFactory from '../index.entry'

const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'asUtils') {
      return {
        getRemoteComponent: (val) => (val)
      }
    }
  }
}

describe('custom/as/libs/lottie', () => {
  it('should render correctly', async () => {
    const lottie = await lottieFactory(RB_CONTEXT)
    expect(lottie).toEqual({
      name: 'lottie',
      libraryName: 'lottie',
      externals: {},
      path: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.5/',
      entries: ['lottie.min.js'],
      version: ''
    })
  })
})
