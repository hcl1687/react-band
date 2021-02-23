import constFactory from '../index.entry'

const CONSTS = constFactory() as Constants.IConsts

describe('common/constants', () => {
  it('should render correctly', () => {
    expect(CONSTS.LOCALE).toMatchSnapshot()
  })
})
