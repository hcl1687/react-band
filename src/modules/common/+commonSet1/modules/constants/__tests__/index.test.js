import module from '../index.entry'

const constFactory = module.entry
const CONSTS = constFactory()

describe('common/constants', () => {
  it('should render correctly', () => {
    expect(CONSTS.LOCALE).toMatchSnapshot()
  })
})
