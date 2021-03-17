declare namespace AssignmentStore {
  interface IActions {
    getAssignmentList: (params: IGetListParams) => Promise<IGetListData>
    getAssignment: (id: string) => Promise<IAssignment>
    editAssignment: (id: string, data: IEditData) => Promise<IEditData>
  }

  interface IResponse {
    data: any
    headers?: {
      'x-total-count': string
    }
  }

  interface IGetListParams {
    current?: number
    pageSize?: number
  }

  interface IGetListData {
    count: number
    assignments: Array<IAssignment>
  }

  interface IAssignment {
    id: string
    ActivityId: string
    Version: string
    Name: string
    PlayType: string
    Accuracy: null
    UsersCount: number
    Questions: number
    CreatedTime: number
    DeadlineTime: number
  }

  interface IEditData {
    id?: string
    ActivityId?: string
    Version?: string
    Name?: string
    PlayType?: string
    Accuracy?: null
    UsersCount?: number
    Questions?: number
    CreatedTime?: number
    DeadlineTime?: number
  }
}
