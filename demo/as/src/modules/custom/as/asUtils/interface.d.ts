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
}
