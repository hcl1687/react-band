import configFactory from '../config'

const config = configFactory()

describe('common/home', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
