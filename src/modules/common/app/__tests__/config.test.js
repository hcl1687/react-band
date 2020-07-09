import configFactory from '../config'

const config = configFactory()

describe('common/app/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
