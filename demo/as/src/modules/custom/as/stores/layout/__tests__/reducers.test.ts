import reducers from '../reducers'

describe('custom/as/stores/layout/reducers', () => {
  it('should render correctly', () => {
    expect(reducers).toMatchSnapshot()
  })

  it('check showLeft', () => {
    const { showLeft: { next: nextFun } } = reducers
    expect(nextFun({}, {
      type: 'showLeft',
      payload: true
    })).toEqual({
      LEFT_STATUS: true
    })
  })

  it('check showHead', () => {
    const { showHead: { next: nextFun } } = reducers
    expect(nextFun({}, {
      type: 'showLeft',
      payload: true
    })).toEqual({
      HEAD_STATUS: true
    })
  })

  it('check setLayout', () => {
    const { setLayout: { next: nextFun } } = reducers
    expect(nextFun({}, {
      type: 'showLeft',
      payload: 'top'
    })).toEqual({
      LAYOUT_MODE: 'top'
    })
  })
})
