import antdIconFactory from '../index.entry'

const antdIcon = antdIconFactory()

describe('common/antdIcon', () => {
  it('should render correctly', () => {
    expect(antdIcon).toMatchSnapshot()
  })
})
