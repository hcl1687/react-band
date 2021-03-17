declare namespace Utils {
  interface IUtils {
    setStatic: (key: string, value: string) => IComponentDeco
    setDisplayName: (displayName: string) => Utils.IComponentDeco
    getDisplayName: (Component?: RB.IRBComponent|string) => string|undefined
    wrapDisplayName: (BaseComponent: RB.IRBComponent|string, hocName: string) => string
    promisify: (fun: (...args: Array<any>) => any) => ((...args: Array<any>) => Promise<any>)
    getUrlParameter: (url: string, name: string) => string
  }

  interface IComponentDeco {
    (component: React.FC<any> | React.ComponentClass<any>): (React.FC<any> | React.ComponentClass<any>) & {
      [propName: string]: any
    }
  }
}
