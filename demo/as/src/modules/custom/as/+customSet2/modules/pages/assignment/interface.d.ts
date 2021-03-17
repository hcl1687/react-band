declare namespace Assignment {
  interface IPaginationState {
    current?: number
    pageSize?: number
    total?: number
  }

  interface ISetPagination {
    (params: IPaginationState): void
  }
}
