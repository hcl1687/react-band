import actionsFactory from '../actions'

const RB_CONTEXT = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (type: string) => {
    if (type === 'asUtils') {
      return {
        request: (data) => {
          if (data.url.includes('GetAssignmentsFeedback?_start')) {
            return Promise.resolve({
              headers: {
                'x-total-count': 2
              },
              data: {
                resData: [{
                  id: 1,
                  name: 'test1'
                }, {
                  id: 2,
                  name: 'test2'
                }],
                reqData: data
              }
            })
          } else if (data.method === 'patch') {
            return Promise.resolve({
              data: {
                resData: '',
                reqData: data
              }
            })
          } else {
            return Promise.resolve({
              data: {
                resData: {
                  id: 1,
                  name: 'test1'
                },
                reqData: data
              }
            })
          }
        }
      }
    } else if (type === 'asConstants') {
      return {
        ENV: {
          JSA_API_DOMAIN: 'JSA_API_DOMAIN'
        }
      }
    }
  }
}

describe('custom/as/stores/assignment/actions', () => {
  it('should render correctly', async () => {
    const actions = await actionsFactory(RB_CONTEXT)
    expect(actions).toMatchSnapshot()
  })

  it('check getAssignmentList', async () => {
    const { getAssignmentList } = await actionsFactory(RB_CONTEXT)

    let ret
    ret = await getAssignmentList({})
    expect(ret.assignments.resData).toEqual([{
      id: 1,
      name: 'test1'
    }, {
      id: 2,
      name: 'test2'
    }])
    expect(ret.count).toBe(2)
    expect(ret.assignments.reqData.url.includes('_start=0&')).toBe(true)
    expect(ret.assignments.reqData.url.includes('&_limit=10')).toBe(true)

    ret = await getAssignmentList({
      current: 2,
      pageSize: 10
    })
    expect(ret.assignments.reqData.url.includes('_start=10&')).toBe(true)
  })

  it('check getAssignment', async () => {
    const { getAssignment } = await actionsFactory(RB_CONTEXT)

    const ret = await getAssignment('xxx')
    expect(ret['resData']).toEqual({
      id: 1,
      name: 'test1'
    })
    expect(ret['reqData'].url.includes('xxx')).toBe(true)
  })

  it('check editAssignment', async () => {
    const { editAssignment } = await actionsFactory(RB_CONTEXT)

    const ret = await editAssignment('xxx', { Name: 'test1' })
    expect(ret['reqData'].url.includes('xxx')).toBe(true)
    expect(ret['reqData'].data).toEqual({
      Name: 'test1'
    })
  })
})
