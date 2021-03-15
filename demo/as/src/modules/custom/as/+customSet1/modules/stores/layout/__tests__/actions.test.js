import actions from '../actions'

describe('custom/as/stores/layout/actions', () => {
  it('should render correctly', async () => {
    expect(actions).toMatchSnapshot()
  })

  it('check showLeft', async () => {
    const { showLeft } = actions
    expect(showLeft(true)).toBe(true)
    expect(showLeft(false)).toBe(false)
  })

  it('check showHead', async () => {
    const { showHead } = actions
    expect(showHead(true)).toBe(true)
    expect(showHead(false)).toBe(false)
  })

  it('check setLayout', async () => {
    const { setLayout } = actions
    expect(setLayout('top')).toBe('top')
    expect(setLayout('left')).toBe('left')
  })
})
