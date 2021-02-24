declare namespace BreadcrumbStore {
  interface IBreadcrumb {
    name: string
    path?: string
    onClick?: () => void
  }

  interface ISetBreadcrumbAction {
    (params: Array<IBreadcrumb>): Array<IBreadcrumb>
  }

  interface ISetBreadcrumb {
    (params: Array<IBreadcrumb>): void
  }

  interface IActions {
    setBreadcrumb: ISetBreadcrumbAction
  }
}
