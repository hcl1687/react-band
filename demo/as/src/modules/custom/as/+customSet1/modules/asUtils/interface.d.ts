declare namespace AsUtils {
  interface IObject {
    [propName: string]: any
  }

  interface IComponentInfo {
    name?: string
    libraryName?: string
    externals?: IObject
    path?: string
    entries?: Array<string> | {
      [propName: string]: string
    }
    version?: string
  }

  type IDependencies = IObject

  interface ISubscribeFun {
    (err: Error|null, comp?: any): void
  }

  interface IReqOptions {
    headers?: IReqHeaders
    iReq: IReqIReq
    iRes: IReqIRes
    resHandler?: IReqResHandler
  }

  interface IReqIReq {
    (options: IReqOptions): IReqOptions
  }

  interface IReqIReqSet {
    pre: Array<IReqIReq>
    post: Array<IReqIReq>
  }

  type IReqIRes = [(res: any) => any, (err: Error) => void]

  interface IReqIResSet {
    pre: Array<IReqIRes>
    post: Array<IReqIRes>
  }

  interface IReqResHandler {
    (data: any): any
  }

  interface IReqHost {
    use: (...args: Array<AsUtils.IReqIReq|AsUtils.IReqIRes>) => void
  }

  interface IReqHeaders {
    Accept?: string
    'Content-Type'?: string
    Authorization?: string
  }

  interface IReqConfig {
    headers?: IReqHeaders
    method?: string
    [propName: string]: any
  }

  interface IGetRemoteCreateScriptParams {
    id: string
    src: string
    onload: () => void
    onerror: () => void
  }

  interface IGetRemoteCreateScript {
    (params: IGetRemoteCreateScriptParams): HTMLScriptElement
  }

  interface IAuth {
    expiry: number
    uid: string
    role: string
    token: string
  }

  interface IUser {
    id: string
    token: string
    userName: string
    userId: string
    email: string
    userType: string
    avatar?: string
  }

  interface IUtils {
    getUrlByKey: (key?: string, type?: string) => string
    getLocalStorageItem: (key: string) => string
    setLocalStorageItem: (key: string, value: string) => void
    removeLocalStorageItem: (key: string) => void
    request: (config: string | IReqConfig) => Promise<unknown>
    safeParse: (str: string) => unknown
    getUser: () => IUser
    getAuth: () => IAuth
    getRemoteComponent: (componentInfo: IComponentInfo, dependencies: IDependencies) => Promise<any>
    getQueryParams: (qs: string) => AsUtils.IObject
  }
}
