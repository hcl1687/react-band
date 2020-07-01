import get from 'lodash/get'

function getFuns (asUtils, asConstants) {
  const { request, setLocalStorageItem } = asUtils
  const { ENV, LOCAL_STORAGE_PREFIX } = asConstants

  const handleToken = ({
    apiToken,
    userName,
    expiryDate,
    userID,
    role,
    token,
    email,
    avatar,
    userType
  }) => {
    const me = {
      name: userName,
      expiry: expiryDate,
      uid: userID,
      role,
      token,
      email,
      avatar,
      userType
    }

    // save to localStorage
    setLocalStorageItem('access_token', apiToken)
    setLocalStorageItem('cudos_token', token)
    const strMe = me ? window.btoa(JSON.stringify(me)) : ''
    setLocalStorageItem('me', strMe)
  }

  const jsLogin = (email, password) => {
    return request({
      method: 'get',
      url: `${ENV.JSA_API_DOMAIN}/authenticate/${email}`
    }).then(res => {
      const data = res.data || {}
      const response = data.info
      const parser = new DOMParser()
      const doc = parser.parseFromString(response, 'application/xml')
      const status = doc.getElementsByTagName('LoginStatus')[0].textContent

      if (status === 'Success') {
        const apiToken = doc.getElementsByTagName('ApiToken')[0].textContent
        const userName = doc.getElementsByTagName('UserName')[0].textContent
        const expiryDate = doc.getElementsByTagName('ExpiryDate')[0].textContent
        const cudosToken = doc.getElementsByTagName('CudosToken')[0].textContent
        const userID = doc.getElementsByTagName('UserID')[0].textContent
        const role = doc.getElementsByTagName('Role')[0].textContent

        const req = request({
          method: 'get',
          url: `${ENV.SERVER_WEBAPI}/${role}/${userID}`
        })
        return req.then((userInfo) => {
          const userType = get(userInfo, 'userType', '')
          const email = get(userInfo, 'email', '')
          const avatar = get(userInfo, 'avatar', '')
          const newUserName = get(userInfo, 'userName', '')
          const newToken = get(userInfo, 'token', '')
          handleToken({
            apiToken,
            userName: newUserName,
            expiryDate,
            userID,
            role,
            token: newToken,
            email,
            avatar,
            userType
          })
        }).catch(() => {
          handleToken({
            apiToken,
            userName,
            expiryDate,
            userID,
            role,
            token: cudosToken,
            email: undefined,
            avatar: undefined,
            userType: undefined
          })
        })
        // return Promise.resolve(true)
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

  function logout (redirectUrl) {
    _clearLocalStorage()
  }

  return {
    jsLogin,
    logout
  }
}

export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const asUtils = await getComponent('asUtils')
  const asConstants = await getComponent('asConstants')
  const { getUser } = asUtils
  const { jsLogin, logout } = getFuns(asUtils, asConstants)

  return {
    login: ({ name, password }) => {
      return jsLogin(name, password).then(success => {
        const user = getUser()
        return user
      }).catch(msg => {
        throw new Error(msg)
      })
    },
    logout: () => {
      logout()
    }
  }
}
