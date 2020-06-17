import constFactory from '../index.entry'

const CONSTS = constFactory()

describe('common/constants', () => {
  it('should render correctly', () => {
    expect(CONSTS.LOCALE).toMatchSnapshot()
  })
})
