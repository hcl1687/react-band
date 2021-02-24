declare namespace Menu {
  interface IMenu {
    path: string
    name: string
  }

  interface IMenuHandle {
    toggleMenu: () => void
  }
}
