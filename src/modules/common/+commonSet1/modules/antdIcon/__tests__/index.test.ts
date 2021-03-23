import module from '../index.entry'

const antdIcon = module.entry()

describe('common/antdIcon', () => {
  it('should render correctly', () => {
    expect(antdIcon).toMatchSnapshot()
  })
})
