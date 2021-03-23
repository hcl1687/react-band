import module from '../index.entry'

const utilsFactory = module.entry
const utils = utilsFactory() as DecoRedux.IUtils

describe('common/redux/utils', () => {
  it('should render correctly', () => {
    expect(utils.getStore).not.toBeUndefined()
  })
})
