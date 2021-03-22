import module from '../index.entry'

const CONSTS = module.entry() as Constants.IConsts

describe('common/constants', () => {
  it('should render correctly', () => {
    expect(CONSTS.LOCALE).toMatchSnapshot()
  })
})
