declare namespace AuthStore {
  interface IActions {
    login: (params: ILoginData) => Promise<AsUtils.IAuth | Error>
    logout: () => void
  }

  interface IResponse {
    data: any
  }

  interface ILoginData {
    email: string
    password: string
  }
}
