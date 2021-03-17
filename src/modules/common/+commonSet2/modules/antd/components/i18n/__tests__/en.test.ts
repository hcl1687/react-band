import en from '../en'

describe('common/antd/comp/i18n/en', () => {
  it('should render correctly', () => {
    expect(en['default']).toMatchSnapshot()
  })
})
