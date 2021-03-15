jest.mock('axios', () => {
  const axios = {
    reqItpsResolve: [],
    reqItpsReject: [],
    resItpsResolve: [],
    resItpsReject: [],
    create: () => {
      axios.reqItpsResolve = []
      axios.reqItpsReject = []
      axios.resItpsResolve = []
      axios.resItpsReject = []

      return {
        interceptors: {
          request: {
            use: (iptsResolve, iptsReject) => {
              if (iptsResolve) {
                axios.reqItpsResolve.push(iptsResolve)
              }
              if (iptsReject) {
                axios.reqItpsReject.push(iptsReject)
              }
            }
          },
          response: {
            use: (iptsResolve, iptsReject) => {
              if (iptsResolve) {
                axios.resItpsResolve.push(iptsResolve)
              }
              if (iptsReject) {
                axios.resItpsReject.push(iptsReject)
              }
            }
          }
        },
        request: (config) => {
          if (config.reject) {
            try {
              if (axios.reqItpsReject.length > 0) {
                axios.reqItpsReject.forEach(ipt => {
                  ipt(config)
                })
              }
              if (axios.resItpsReject.length > 0) {
                axios.resItpsReject.forEach(ipt => {
                  ipt(config)
                })
              }
            } catch {
              console.log('')
            }

            return Promise.reject(config)
          }

          if (axios.reqItpsResolve.length > 0) {
            axios.reqItpsResolve.forEach(ipt => {
              ipt(config)
            })
          }
          if (axios.resItpsResolve.length > 0) {
            axios.resItpsResolve.forEach(ipt => {
              ipt(config)
            })
          }

          return Promise.resolve(config)
        }
      }
    }
  }

  return axios
})

const getRequestProvider = require('../request')

describe('custom/as/asUtils/request', () => {
  it('should request correctly', () => {
    const instance = getRequestProvider()
    return instance['get']({
      url: 'www.test.com'
    }).then(res => {
      expect(res).toEqual({
        method: 'GET',
        url: 'www.test.com',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
    })
  })

  it('check intercept', () => {
    const reqIpts = [config => {
      config.reqIpt = 1
    }]
    const resIpts = [res => {
      res.resIpt = 1
    }]

    const instance = getRequestProvider()
    instance.intercept(reqIpts, resIpts)

    return instance['get']({
      url: 'www.test.com'
    }).then(res => {
      instance.client.iReq.pre = []
      instance.client.iRes.pre = []
      const axios = require('axios')
      axios.reqItpsResolve.pop()
      axios.resItpsResolve.pop()

      expect(res).toEqual({
        method: 'GET',
        url: 'www.test.com',
        reqIpt: 1,
        resIpt: 1,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
    })
  })

  it('check _request', () => {
    const instance = getRequestProvider()
    return instance['_request']({
      url: 'www.test.com'
    }).then(res => {
      expect(res).toEqual({
        method: 'GET',
        url: 'www.test.com',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
    })
  })

  it('check token', () => {
    const instance = getRequestProvider('xxx')
    return instance['_request']({
      url: 'www.test.com'
    }).then(res => {
      expect(res).toEqual({
        method: 'GET',
        url: 'www.test.com',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer xxx'
        }
      })
    })
  })

  it('check 401', () => {
    const instance = getRequestProvider()
    return instance['_request']({
      url: 'www.test.com',
      reject: 1,
      response: {
        status: 401
      }
    }).catch(res => {
      expect(res).toEqual({
        method: 'GET',
        url: 'www.test.com',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        reject: 1,
        response: {
          status: 401
        }
      })
    })
  })

  it('should post correctly', () => {
    const instance = getRequestProvider()
    return instance['post']({
      url: 'www.test.com',
      data: 1
    }).then(res => {
      expect(res).toEqual({
        method: 'POST',
        url: 'www.test.com',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        data: 1
      })
    })
  })

  it('should delete correctly', () => {
    const instance = getRequestProvider()
    return instance['delete']({
      url: 'www.test.com/1'
    }).then(res => {
      expect(res).toEqual({
        method: 'DELETE',
        url: 'www.test.com/1',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
    })
  })

  it('should patch correctly', () => {
    const instance = getRequestProvider()
    return instance['patch']({
      url: 'www.test.com/1',
      data: 1
    }).then(res => {
      expect(res).toEqual({
        method: 'PATCH',
        url: 'www.test.com/1',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        data: 1
      })
    })
  })

  it('should put correctly', () => {
    const instance = getRequestProvider()
    return instance['put']({
      url: 'www.test.com/1',
      data: 1
    }).then(res => {
      expect(res).toEqual({
        method: 'PUT',
        url: 'www.test.com/1',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        data: 1
      })
    })
  })
})
