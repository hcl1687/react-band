declare namespace DecoNotice {
  type INoticeArgs = [INoticeParams] | [
    INoticeParams,
    INoticeResovle,
    INoticeReject
  ]

  interface INoticeObject {
    [propName: string]: any
  }

  type INoticeParams = INoticeObject

  interface INoticeResovle {
    (value?: any | PromiseLike<any>): void
  }

  type INoticeReject = INoticeResovle

  interface INoticeTarget {
    current: INoticeObject
    [propName: string]: any
  }

  interface INoticeProps {
    notification?: INoticeObject
    getNotification?: INoticeGetNotification
    notify?: INoticeNotify
    setNotifyHandler?: INoticeSetNotifyHandler
  }

  interface INoticeGetNotification {
    (childName: string): {
      notification: INoticeObject
    }
  }

  interface INoticeNotify {
    (childName: string, methodName: string, params: INoticeParams): Promise<any>
  }

  interface INoticeSetNotifyHandler {
    (handlers: INoticeObject, ref: React.Ref<unknown>): void
  }

  interface INoticeInst {
    state: INoticeObject
    setState?: (val: INoticeObject) => void
  }

  type INoticeUseNotice = [
    (childName: string) => { notification: any },
    (childName: string, methodName: string, params: INoticeParams) => Promise<unknown>,
    (handlers: INoticeObject, ref: any) => void
  ]
}
