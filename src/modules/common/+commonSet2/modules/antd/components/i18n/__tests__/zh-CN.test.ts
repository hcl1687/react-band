import zhCN from '../zh-CN'

describe('common/antd/comp/i18n/zh-CN', () => {
  it('should render correctly', () => {
    expect(zhCN['default']).toMatchSnapshot()
  })
})
