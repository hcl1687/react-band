import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise'

const loggerMiddleware = createLogger()

export default [
  promiseMiddleware,
  loggerMiddleware
]
