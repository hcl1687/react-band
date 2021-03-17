declare namespace Login {
  interface ILoginHandle {
    show: (params: IShowParams) => void
  }

  interface IShowParams {
    visible: boolean
    [propName: string]: any
  }
}
