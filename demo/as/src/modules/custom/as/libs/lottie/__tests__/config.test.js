import configFactory from '../config'

const config = configFactory()

describe('custom/as/libs/lottie/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
