import configFactory from '../config'

const config = configFactory()

describe('common/antd/comp/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
