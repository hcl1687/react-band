import configFactory from '../config'

const config = configFactory()

describe('common/antdIcon/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
