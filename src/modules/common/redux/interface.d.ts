declare namespace DecoRedux {
  interface IReduxObject {
    [propName: string]: any
  }

  type IReduxState = IReduxObject

  interface IReduxActionFactory {
    (...args: Array<any>): any
  }

  interface IReduxActionFactories {
    [propName: string]: IReduxActionFactory
  }

  interface IReduxAction {
    type: string
    payload?: any
  }

  interface IReduxReducer {
    next: (state: IReduxState, action: IReduxAction) => IReduxState
    throw: (state: IReduxState, action: IReduxAction) => IReduxState
  }

  interface IReduxReducers {
    [propName: string]: IReduxReducer
  }

  interface IReduxPlainReducer {
    (state: IReduxState, action: IReduxAction): IReduxState
  }

  interface IReduxPlainReducers {
    [propName: string]: IReduxPlainReducer
  }

  interface IReduxStore {
    asyncReducers: {
      [propName: string]: IReduxPlainReducer
    }
    injectReducer: (key: string, asyncReducer: IReduxPlainReducer) => void
    [propName: string]: any
  }

  interface IReduxConfig {
    [propName: string]: {
      actions: Array<string>
      state: Array<string>
    }
  }

  interface IReduxModule {
    actions: IReduxActionFactories
    reducers: IReduxReducers
    state: IReduxState
  }
}
