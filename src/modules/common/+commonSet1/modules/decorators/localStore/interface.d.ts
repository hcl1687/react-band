declare namespace DecoLocalStore {
  interface ILocalState {
    [propName: string]: any
  }

  interface ILocalActionFactory {
    (...args: Array<any>): any
  }

  interface ILocalActionFactories {
    [propName: string]: ILocalActionFactory
  }

  interface ILocalAction {
    type: string
    payload?: any
  }

  interface ILocalReducer {
    next: (state: ILocalState, action: ILocalAction) => ILocalState
    throw: (state: ILocalState, action: ILocalAction) => ILocalState
  }

  interface ILocalReducers {
    [propName: string]: ILocalReducer
  }

  interface ILocalStore {
    state: ILocalState
    actions: ILocalActionFactories
    reducers: ILocalReducers
  }

  interface ILocalStoreFactory {
    (RB_CONTEXT: RB.IRBContext): ILocalStore
  }
}
