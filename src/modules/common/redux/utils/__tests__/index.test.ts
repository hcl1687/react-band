import utilsFactory from '../index.entry'

const utils: RB.IRBModule = utilsFactory()

describe('common/redux/utils', () => {
  it('should render correctly', () => {
    expect(utils.getStore).not.toBeUndefined()
  })
})
