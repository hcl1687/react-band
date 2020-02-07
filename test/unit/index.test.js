import { render, shallow } from 'enzyme'
import Home from '../../src/modules/home/index.jsx'
import React from 'react'
import Student from '../../src/modules/student/index.jsx'
import Teacher from '../../src/modules/teacher/index.jsx'
import process from 'process'

// see https://2ality.com/2016/04/unhandled-rejections.html#unhandled-rejections-in-browsers
process.on('unhandledRejection', (reason) => {
  console.log('Reason: ' + reason)
})

describe('test react component', function () {
  it('test home page', () => {
    const comp = shallow(<Home />)
    expect(comp.text()).toEqual('老师入口学生入口')
  })
  it('test teacher', () => {
    const comp = render(<Teacher />)
    expect(comp.find('#btn-exit').text()).toEqual('退出课堂')
  })
  it('test student', () => {
    const comp = shallow(<Student />)
    expect(comp.find('.student-portal').length).toEqual(1)
  })
})
