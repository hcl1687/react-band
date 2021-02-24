import configFactory from '../config'

const config = configFactory()

describe('custom/as/pages/assignment/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
