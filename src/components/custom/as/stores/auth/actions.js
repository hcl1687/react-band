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
    const data = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Authenticate xmlns="http://api.jumpstart.com/">
          <apiKey>BDD36F3E-058F-4167-8F7B-77616C1FB3F6</apiKey>
          <AuthenticationData>
            <UserName>${email}</UserName>
            <Password>${password}</Password>
            <Locale>en-US</Locale>
          </AuthenticationData>
        </Authenticate>
      </soap:Body>
    </soap:Envelope>`

    return request({
      method: 'post',
      url: `${ENV.JSA_API_DOMAIN}/common/v5/AuthenticationWebService.asmx?op=Authenticate`,
      headers: {
        'content-type': 'text/xml'
      },
      data
    }).then(response => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(response, 'application/xml')
      const status = doc.getElementsByTagName('LoginStatus')[0].textContent

      if (status === 'Success') {
        const apiToken = doc.getElementsByTagName('ApiToken')[0].textContent
        const userName = doc.getElementsByTagName('UserName')[0].textContent
        const expiryDate = doc.getElementsByTagName('ExpiryDate')[0].textContent
        let cudosToken = doc.getElementsByTagName('CudosToken')[0].textContent
        const userID = doc.getElementsByTagName('UserID')[0].textContent
        const role = doc.getElementsByTagName('Role')[0].textContent

        // This should come from the response - temp for now
        if (cudosToken === null || cudosToken === undefined || cudosToken.length === 0) {
          cudosToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUZXN0VXNlciIsImp0aSI6IjRmMGVhOWQ0LWNiY2QtNGUyOC1hNWUzLWVhNzYzYzllNTlkMiIsImxvY2FsZSI6ImVuLVVTIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJUZXN0VXNlciIsImFwcGlkIjoiNzc1QkMxRjEtRTA2NC1FQzhFLThBNDMtQzY0NzdERjlEMDU2IiwidXNlcmlkIjoiOWI1YmRlYTQtMjljMi00MmVmLTg5ZjktMTk0MWU2YjQ1YmMxIiwicGlkIjoiYzIwZTRjNDYtZDI0Ni00N2QyLWFmNTUtOGFmNDRkMDdhODg2IiwiZXhwIjoxNTYwMjYwNzkyLCJpc3MiOiJIdHRwczovL0N1RE9TLkp1bXBTdGFydC5jb20iLCJhdWQiOiJIdHRwczovL0N1RE9TLkp1bXBTdGFydC5jb20ifQ.JSVRORmOBYJNmzCkM-cYCFpLgSeZVuT55ggERC8oE28'
          console.log('CuDOS Token: ' + cudosToken)
        }
        const req = request({
          method: 'post',
          url: `${ENV.SERVER_WEBAPI}/auth/v2/Token/${role}`,
          headers: {
            Authorization: `Bearer ${cudosToken}`
          }
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
