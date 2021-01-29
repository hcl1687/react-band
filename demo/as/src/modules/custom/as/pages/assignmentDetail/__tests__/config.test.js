import configFactory from '../config'

const config = configFactory()

describe('custom/as/pages/assignmentDetail/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
