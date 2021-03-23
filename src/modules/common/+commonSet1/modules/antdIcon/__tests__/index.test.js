import module from '../index.entry'

const antdIconFactory = module.entry
const antdIcon = antdIconFactory()

describe('common/antdIcon', () => {
  it('should render correctly', () => {
    expect(antdIcon).toMatchSnapshot()
  })
})
