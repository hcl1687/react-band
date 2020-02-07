import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import toJson from 'enzyme-to-json'

Enzyme.configure({ adapter: new Adapter() })
chai.use(sinonChai)

global.TEST_UTILS = {
  chai,
  assert: chai.assert,
  expect: chai.expect,
  should: chai.should(),
  shallow: Enzyme.shallow,
  render: Enzyme.render,
  toJson
}

const testsContext = require.context('./', true, /\.spec\.jsx?$/)
testsContext.keys().forEach(testsContext)

const srcContext = require.context('../src/', true, /\.jsx?$/)
srcContext.keys().forEach(srcContext)
