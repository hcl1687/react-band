function getFuns (asUtils, asConstants) {
  const { request, setLocalStorageItem } = asUtils
  const { ENV, LOCAL_STORAGE_PREFIX } = asConstants

  const handleToken = ({
    apiToken,
    expiryDate,
    userID,
    role,
    token
  }) => {
    const auth = {
      expiry: expiryDate,
      uid: userID,
      role,
      token
    }

    // save to localStorage
    setLocalStorageItem('access_token', apiToken)
    setLocalStorageItem('cudos_token', token)
    const strAuth = auth ? window.btoa(JSON.stringify(auth)) : ''
    setLocalStorageItem('auth', strAuth)
  }

  const jsLogin = (email: string, password: string) => {
    // password is not used in this demo
    console.log(password)

    return request({
      method: 'get',
      url: `${ENV.JSA_API_DOMAIN}/authenticate/${email}`
    }).then((res: AuthStore.IResponse) => {
      const data = res.data || {}
      const response = data.info
      const parser = new DOMParser()
      const doc = parser.parseFromString(response, 'application/xml')
      const status = doc.getElementsByTagName('LoginStatus')[0].textContent

      if (status === 'Success') {
        const apiToken = doc.getElementsByTagName('ApiToken')[0].textContent
        const expiryDate = doc.getElementsByTagName('ExpiryDate')[0].textContent
        const cudosToken = doc.getElementsByTagName('CudosToken')[0].textContent
        const userID = doc.getElementsByTagName('UserID')[0].textContent
        const role = doc.getElementsByTagName('Role')[0].textContent

        handleToken({
          apiToken,
          expiryDate,
          userID,
          role,
          token: cudosToken
        })
      } else {
        return Promise.reject(status)
      }
    })
  }

  function _clearLocalStorage () {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.indexOf(LOCAL_STORAGE_PREFIX) === 0) {
        keys.push(key)
      }
    }

    keys.forEach(key => {
      localStorage.removeItem(key)
    })
  }

  function logout () {
    _clearLocalStorage()
  }

  return {
    jsLogin,
    logout
  }
}

export default async (RB_CONTEXT: RB.IRBContext): Promise<AuthStore.IActions> => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils')
  const asConstants = await getModule('asConstants')
  const { getAuth } = asUtils as AsUtils.IUtils
  const { jsLogin, logout } = getFuns(asUtils, asConstants)

  return {
    login: ({ email, password }) => {
      return jsLogin(email, password).then(() => {
        const auth = getAuth()
        return auth
      }).catch((msg: string) => {
        throw new Error(msg)
      })
    },
    logout: () => {
      logout()
    }
  }
}
