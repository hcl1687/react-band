declare namespace BreadcrumbStore {
  interface IBreadcrumb {
    name: string
    path?: string
    onClick?: () => void
  }

  interface IActions {
    setBreadcrumb: (params: Array<IBreadcrumb>) => Array<IBreadcrumb>
  }
}
