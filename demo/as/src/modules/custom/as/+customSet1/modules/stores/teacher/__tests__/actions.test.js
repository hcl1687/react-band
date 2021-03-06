import actionsFactory from '../actions'

const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'asUtils') {
      return {
        request: (data) => {
          if (data.method === 'get') {
            return Promise.resolve({
              data: {
                id: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
                userName: 'Colin He',
                userId: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
                email: 'colin@hcl1687.com',
                userType: 'Teacher'
              }
            })
          } else if (data.method === 'patch') {
            return Promise.resolve({
              data: {
                resData: '',
                reqData: data
              }
            })
          }
        },
        setLocalStorageItem: (key, value) => {
          localStorage.setItem(`AB_${key}`, value)
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

describe('custom/as/stores/teacher/actions', () => {
  it('should render correctly', async () => {
    const actions = await actionsFactory(RB_CONTEXT)
    expect(actions).toMatchSnapshot()
  })

  it('check getTeacher', async () => {
    const { getTeacher } = await actionsFactory(RB_CONTEXT)

    const ret = await getTeacher('xx')
    expect(ret).toEqual({
      id: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
      userName: 'Colin He',
      userId: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
      email: 'colin@hcl1687.com',
      userType: 'Teacher'
    })
  })

  it('check editTeacher', async () => {
    const { editTeacher } = await actionsFactory(RB_CONTEXT)

    const ret = await editTeacher('xxx', { name: 'test1' })
    expect(ret).toEqual({
      name: 'test1'
    })
  })
})
