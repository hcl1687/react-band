import menus from '../menus'

describe('custom/as/framework/menu/menus', () => {
  it('should render correctly', () => {
    expect(menus).toMatchSnapshot()
  })
})
