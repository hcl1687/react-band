declare namespace Menu {
  interface IMenu {
    path: string
    name: string
    icon: string
  }

  type IThemeType = 'light' | 'dark'
  type IModeType = 'inline' | 'vertical'
  interface IClickEvent {
    key: string
  }

  interface IMenuHandle {
    toggleMenu: () => void
  }
}
