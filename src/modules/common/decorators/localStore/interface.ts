import { IRBContext } from '~/interface'

export interface ILocalState {
  [propName: string]: any
}

export interface ILocalActionFactory {
  (...args: Array<any>): any
}

export interface ILocalActionFactories {
  [propName: string]: ILocalActionFactory
}

export interface ILocalAction {
  type: string
  payload?: any
}

export interface ILocalReducer {
  next: (state: ILocalState, action: ILocalAction) => ILocalState
  throw: (state: ILocalState, action: ILocalAction) => ILocalState
}

export interface ILocalReducers {
  [propName: string]: ILocalReducer
}

export interface ILocalStore {
  state: ILocalState
  actions: ILocalActionFactories
  reducers: ILocalReducers
}

export interface ILocalStoreFactory {
  (RB_CONTEXT: IRBContext): ILocalStore
}
