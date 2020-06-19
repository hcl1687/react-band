import axios from 'axios'

class RequestClient {
  constructor (iReqGlobal, iResGlobal, resHandler = ({ data }) => data) {
    this.iReqGlobal = iReqGlobal
    this.iResGlobal = iResGlobal
    this.resHandler = resHandler
    this.iReq = { pre: [], post: [] }
    this.iRes = { pre: [], post: [] }
  }

  intercept (iReq, iRes, enforce = 'pre') {
    iReq && this.iReq[enforce].push(iReq)
    iRes && this.iRes[enforce].push(iRes)
  }

  _iterate (host, ...args) {
    args.forEach(arg => {
      if (arg) {
        host.use(...[].concat(arg))
      }
    })
  }

  request (config, iReqPre, iResPre, iReqPost, iResPost, iReqFinal, iResFinal) {
    const io = axios.create()
    const { request, response } = io.interceptors
    this._iterate(request, iReqFinal, iReqPost,
      ...this.iReq.post, ...this.iReq.pre, this.iReqGlobal, iReqPre)
    this._iterate(response, iResFinal, iResPost,
      ...this.iRes.post, ...this.iRes.pre, this.iResGlobal, iResPre)

    return io.request(config).then(this.resHandler)
  }
}

class Request {
  static defaultOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  constructor (options) {
    const { iReq, iRes, resHandler, headers } = Object.assign({}, Request.defaultOptions, options)
    this.headers = headers
    this.client = new RequestClient(iReq, iRes, resHandler)
  }

  intercept (iReq, iRes, enforce) {
    this.client.intercept(iReq, iRes, enforce)
  }

  _request (config, method, iReqPre, iResPre, iReqPost, iResPost) {
    const headers = { ...this.headers, ...config.headers }
    if (!method) {
      method = config.method || 'GET'
    }
    const args = [{ ...config, method, headers }, iReqPre, iResPre, iReqPost, iResPost]

    return this.client.request(...args)
  }

  get (config, ...args) {
    return this._request(config, 'GET', ...args)
  }

  post (config, ...args) {
    return this._request(config, 'POST', ...args)
  }

  delete (config, ...args) {
    return this._request(config, 'DELETE', ...args)
  }

  patch (config, ...args) {
    return this._request(config, 'PATCH', ...args)
  }

  put (config, ...args) {
    return this._request(config, 'PUT', ...args)
  }
}

let token
let instance
export default function getRequestProvider (_token) {
  token = _token
  if (!instance) {
    instance = new Request({
      iReq: options => {
        if (!options.headers.Authorization && token) {
          options.headers.Authorization = 'Bearer ' + token
        }

        return options
      },
      iRes: [res => res, err => {
        // handle 401, redirect to the logout page.
        if (err.response && err.response.status === 401) {
          console.log('invalid token')
        }

        throw err
      }]
    })
  }

  return instance
}
