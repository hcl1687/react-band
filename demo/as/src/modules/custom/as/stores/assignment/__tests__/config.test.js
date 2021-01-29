import configFactory from '../config'

const config = configFactory()

describe('custom/as/stores/assignment/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
