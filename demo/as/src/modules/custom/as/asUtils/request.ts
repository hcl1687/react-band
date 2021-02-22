import axios, { AxiosError, AxiosRequestConfig } from 'axios'

class RequestClient {
  private iReqGlobal: AsUtils.IReqIReq

  private iResGlobal: AsUtils.IReqIRes

  private resHandler: AsUtils.IReqResHandler

  private iReq: AsUtils.IReqIReqSet

  private iRes: AsUtils.IReqIResSet

  constructor (iReqGlobal: AsUtils.IReqIReq, iResGlobal: AsUtils.IReqIRes, resHandler: AsUtils.IReqResHandler = (data) => data) {
    this.iReqGlobal = iReqGlobal
    this.iResGlobal = iResGlobal
    this.resHandler = resHandler
    this.iReq = { pre: [], post: [] }
    this.iRes = { pre: [], post: [] }
  }

  intercept (iReq: AsUtils.IReqIReq, iRes: AsUtils.IReqIRes, enforce = 'pre') {
    iReq && this.iReq[enforce].push(iReq)
    iRes && this.iRes[enforce].push(iRes)
  }

  _iterate (host: AsUtils.IReqHost, ...args: Array<AsUtils.IReqIReq|AsUtils.IReqIRes>) {
    args.forEach(arg => {
      if (arg) {
        host.use(...[].concat(arg))
      }
    })
  }

  request (config: AsUtils.IReqConfig, iReqPre: AsUtils.IReqIReq, iResPre: AsUtils.IReqIRes,
    iReqPost: AsUtils.IReqIReq, iResPost: AsUtils.IReqIRes, iReqFinal?: AsUtils.IReqIReq,
    iResFinal?: AsUtils.IReqIRes
  ) {
    const io = axios.create()
    const { request, response } = io.interceptors
    this._iterate(request as AsUtils.IReqHost, iReqFinal, iReqPost,
      ...this.iReq.post, ...this.iReq.pre, this.iReqGlobal, iReqPre)
    this._iterate(response as unknown as AsUtils.IReqHost, iResFinal, iResPost,
      ...this.iRes.post, ...this.iRes.pre, this.iResGlobal, iResPre)

    return io.request(config as AxiosRequestConfig).then(this.resHandler)
  }
}

class Request {
  static defaultOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  private headers: AsUtils.IReqHeaders

  private client: RequestClient

  constructor (options: AsUtils.IReqOptions) {
    const { iReq, iRes, resHandler, headers } = Object.assign({}, Request.defaultOptions, options)
    this.headers = headers
    this.client = new RequestClient(iReq, iRes, resHandler)
  }

  intercept (iReq: AsUtils.IReqIReq, iRes: AsUtils.IReqIRes, enforce: string) {
    this.client.intercept(iReq, iRes, enforce)
  }

  _request (config: AsUtils.IReqConfig, method: string, iReqPre?: AsUtils.IReqIReq,
    iResPre?: AsUtils.IReqIRes, iReqPost?: AsUtils.IReqIReq, iResPost?: AsUtils.IReqIRes) {
    const headers = { ...this.headers, ...config.headers }
    if (!method) {
      method = config.method || 'GET'
    }

    return this.client.request({ ...config, method, headers }, iReqPre, iResPre, iReqPost, iResPost)
  }

  get (config: AsUtils.IReqConfig, ...args: Array<any>) {
    return this._request(config, 'GET', ...args)
  }

  post (config: AsUtils.IReqConfig, ...args: Array<any>) {
    return this._request(config, 'POST', ...args)
  }

  delete (config: AsUtils.IReqConfig, ...args: Array<any>) {
    return this._request(config, 'DELETE', ...args)
  }

  patch (config: AsUtils.IReqConfig, ...args: Array<any>) {
    return this._request(config, 'PATCH', ...args)
  }

  put (config: AsUtils.IReqConfig, ...args: Array<any>) {
    return this._request(config, 'PUT', ...args)
  }
}

let token: string
let instance: Request
export default function getRequestProvider (_token: string): Request {
  token = _token
  if (!instance) {
    instance = new Request({
      iReq: (options: AsUtils.IReqOptions): AsUtils.IReqOptions => {
        if (!options.headers.Authorization && token) {
          options.headers.Authorization = 'Bearer ' + token
        }

        return options
      },
      iRes: [res => res, (err: AxiosError) => {
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
