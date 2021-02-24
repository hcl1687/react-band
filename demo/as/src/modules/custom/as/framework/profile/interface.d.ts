declare namespace Profile {
  interface IProfileHandle {
    show: (params: IShowParams) => void
  }

  interface IShowParams {
    visible: boolean
    [propName: string]: any
  }
}
