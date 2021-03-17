import utilsFactory from '../index.entry'

const utils = utilsFactory() as DecoRedux.IUtils

describe('common/redux/utils', () => {
  it('should render correctly', () => {
    expect(utils.getStore).not.toBeUndefined()
  })
})
