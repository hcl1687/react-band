declare namespace TeacherStore {
  interface IActions {
    getTeacher: (id: string) => Promise<AsUtils.IUser>
    editTeacher: (id: string, data: IEditData) => Promise<IEditData>
  }

  interface IResponse {
    data: any
  }

  interface IEditData {
    id?: string
    token?: string
    userName: string
    userId?: string
    email?: string
    userType?: string
    avatar?: string
  }
}
