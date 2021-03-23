import module from '../index.entry'

const antdFactory = module.entry
const antd = antdFactory()

describe('common/antd/comp', () => {
  it('should render correctly', () => {
    expect(antd).toMatchSnapshot()
  })
})
