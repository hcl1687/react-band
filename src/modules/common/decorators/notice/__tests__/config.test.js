import configFactory from '../config'

const config = configFactory()

describe('common/decorators/notice/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
