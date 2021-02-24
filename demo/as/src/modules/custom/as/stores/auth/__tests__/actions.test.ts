import actionsFactory from '../actions'

const RB_CONTEXT: RB.IRBContext = {
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
        request: (data: AsUtils.IReqConfig) => {
          if (data.url.includes('test@hcl1687.com')) {
            return Promise.resolve({
              data: {
                id: 'test@hcl1687.com',
                message: 'login success.',
                info: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><AuthenticateResponse xmlns="http://api.hcl1687.com/"><AuthenticationInfo><UserName>Grade1_Janardan@hcl1687.com</UserName><Email>grade1_janardan@hcl1687.com</Email><ApiToken>278bdb8e-83b2-4531-96a6</ApiToken><UserID>bc747106-df91-48c0-a0b8-15ac66b891a5</UserID><AccountOwnerLoginInfo xsi:nil="true" /><CudosToken>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</CudosToken><ExpiryDate xsi:nil="true" /><LoginStatus>Success</LoginStatus><Role>Teacher</Role><UnAuthorized>true</UnAuthorized><IsUserAllowedToPlay xsi:nil="true" /><gsk>11A0CC5A-C4DF-4A0E-931C-09A44C9966AE</gsk><isFirstTimeUser>false</isFirstTimeUser></AuthenticationInfo></AuthenticateResponse></soap:Body></soap:Envelope>'
              }
            })
          } else if (data.url.includes('test1@hcl1687.com')) {
            return Promise.resolve({
              data: {
                id: 'test1@hcl1687.com',
                message: 'login error.',
                info: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><AuthenticateResponse xmlns="http://api.hcl1687.com/"><AuthenticationInfo><UserName xsi:nil="true" /><Email xsi:nil="true" /><ApiToken>332b72cf-e351-412b</ApiToken><UserID>00000000-0000-0000-0000-000000000000</UserID><AccountOwnerLoginInfo xsi:nil="true" /><CudosToken xsi:nil="true" /><ExpiryDate xsi:nil="true" /><LoginStatus>InvalidPassword</LoginStatus><Role>Teacher</Role><UnAuthorized xsi:nil="true" /><IsUserAllowedToPlay xsi:nil="true" /><gsk>11A0CC5A-C4DF-4A0E-931C-09A44C9966AE</gsk><isFirstTimeUser>false</isFirstTimeUser></AuthenticationInfo></AuthenticateResponse></soap:Body></soap:Envelope>'
              }
            })
          }
        },
        setLocalStorageItem: (key: string, value: string) => {
          localStorage.setItem(`AB_${key}`, value)
        },
        getAuth: () => {
          const auth = JSON.parse(atob(localStorage.getItem('AB_auth')))
          return auth
        }
      }
    } else if (type === 'asConstants') {
      return {
        ENV: {
          JSA_API_DOMAIN: 'JSA_API_DOMAIN'
        },
        LOCAL_STORAGE_PREFIX: 'AB_'
      }
    }
  }
}

describe('custom/as/stores/auth/actions', () => {
  it('should render correctly', async () => {
    const actions = await actionsFactory(RB_CONTEXT)
    expect(actions).toMatchSnapshot()
  })

  it('check login successfully', async () => {
    const { login } = await actionsFactory(RB_CONTEXT)

    const auth = await login({
      email: 'test@hcl1687.com',
      password: '123'
    }) as AsUtils.IAuth
    expect(localStorage.getItem('AB_access_token')).toBe('278bdb8e-83b2-4531-96a6')
    expect(auth.role).toBe('Teacher')
    expect(auth.uid).toBe('bc747106-df91-48c0-a0b8-15ac66b891a5')
  })

  it('check login failed', async () => {
    const { login } = await actionsFactory(RB_CONTEXT)

    return login({
      email: 'test1@hcl1687.com',
      password: '123'
    }).catch(err => {
      expect(err.message).toBe('InvalidPassword')
    })
  })

  it('check logout', async () => {
    const { login, logout } = await actionsFactory(RB_CONTEXT)

    await login({
      email: 'test@hcl1687.com',
      password: '123'
    })

    expect(localStorage.getItem('AB_access_token')).toBe('278bdb8e-83b2-4531-96a6')

    await logout()
    expect(localStorage.length).toBe(0)
  })
})
