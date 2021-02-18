import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { configure } from 'enzyme'
// https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
React.useLayoutEffect = React.useEffect

const mockConsoleMethod = (realConsoleMethod) => {
  const ignoredMessages = [
    'test was not wrapped in act(...)'
  ]

  return (message, ...args) => {
    const containsIgnoredMessage = ignoredMessages.some(ignoredMessage => message.includes(ignoredMessage))

    if (!containsIgnoredMessage) {
      realConsoleMethod(message, ...args)
    }
  }
}

// https://github.com/enzymejs/enzyme/issues/2073
console.warn = jest.fn(mockConsoleMethod(console.warn))
console.error = jest.fn(mockConsoleMethod(console.error))

configure({ adapter: new Adapter() })
