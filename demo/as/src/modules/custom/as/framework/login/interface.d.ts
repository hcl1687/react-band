declare namespace Login {
  interface LoginHandle {
    show: (params: IShowParams) => void
  }

  interface IShowParams {
    visible: boolean
    [propName: string]: any
  }
}
