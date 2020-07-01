import configFactory from '../config'

const config = configFactory()

describe('demo/basic/home/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
