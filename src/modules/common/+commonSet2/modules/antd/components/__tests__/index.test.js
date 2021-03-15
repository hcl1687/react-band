import antdFactory from '../index.entry'

const antd = antdFactory()

describe('common/antd/comp', () => {
  it('should render correctly', () => {
    expect(antd).toMatchSnapshot()
  })
})
