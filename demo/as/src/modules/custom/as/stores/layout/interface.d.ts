declare namespace LayoutStore {
  interface IActions {
    showLeft: (show: boolean) => boolean
    showHead: (show: boolean) => boolean
    setLayout: (mode: string) => string
  }
}
