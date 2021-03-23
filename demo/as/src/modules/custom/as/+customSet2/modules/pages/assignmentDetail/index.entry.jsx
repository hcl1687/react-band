import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import get from 'lodash/get'
import { useHistory } from 'react-router-dom'
import zhCN from './i18n/zh-CN.json'

const entry = async ({ getModule }) => {
  const asUtils = await getModule('asUtils')
  const antd = await getModule('antd')
  const moment = await getModule('moment')
  const { DatePicker, Form, Input, InputNumber, Button, Select, Spin, message } = antd
  const { Option } = Select
  const { getQueryParams } = asUtils

  function AssignmentDetail (props) {
    const { theme, assignment, getAssignment, editAssignment, __, setBreadcrumb,
      multiview_actived } = props
    const [form] = Form.useForm()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [commitLoading, setCommitLoading] = useState(false)
    const prevPropsRef = useRef()
    useEffect(() => {
      prevPropsRef.current = props
    })
    const prevProps = prevPropsRef.current || {}

    useEffect(() => {
      const id = getQueryParam(props, 'id')
      const preId = getQueryParam(prevProps, 'id')
      if (id !== preId && id) {
        getDetail(id)
      }
    })

    useEffect(() => {
      if (multiview_actived === undefined || multiview_actived === 'true') {
        // if open assignmentDetial in the browser's address bar
        // or open it in multiView component
        // show breadcrumb
        setBreadcrumb([{
          name: __('assignment'),
          path: 'assignment'
        }, {
          name: __('assignmentDetail'),
          path: 'assignment'
        }])
      }

      return () => {
        setBreadcrumb([])
      }
    })

    useEffect(() => {
      form.setFieldsValue(handleValues(assignment))
    }, [assignment])

    const handleCancel = () => {
      form.resetFields()

      setCommitLoading(false)
      history.goBack()
    }

    const getQueryParam = (props, key) => {
      const search = get(props, 'location.search')
      const query = getQueryParams(search) || {}

      return query[key]
    }

    const handleFinish = (values) => {
      values.CreatedTime = Math.floor(values.CreatedTime.valueOf() / 1000)
      values.DeadlineTime = Math.floor(values.DeadlineTime.valueOf() / 1000)
      setCommitLoading(true)
      const id = getQueryParam(props, 'id')
      editAssignment(id, values).then(() => {
        handleCancel()
        setCommitLoading(false)
        message.success(__('success'))
      }).catch(err => {
        message.error(err.message)
        setCommitLoading(false)
      })
    }

    const getDetail = (id) => {
      setLoading(true)
      getAssignment(id).finally(() => {
        setLoading(false)
      })
    }

    const playTypeFormatter = (value) => {
      if (!value) {
        value = 0
      }
      return `${value}%`
    }

    const playTypeParser = (value) => {
      return value.replace('%', '')
    }

    const handleValues = (values) => {
      var ret = { ...values }
      ret.CreatedTime = moment((ret.CreatedTime || 0) * 1000)
      ret.DeadlineTime = moment((ret.DeadlineTime || 0) * 1000)

      return ret
    }

    function createForm () {
      const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      }
      const tailLayout = {
        wrapperCol: { offset: 3, span: 21 }
      }
      const initialValues = handleValues(assignment)

      return <Form form={form} initialValues={initialValues} {...layout} onFinish={handleFinish} >
        <Form.Item
          label={__('id')}
          name='id' >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={__('activityId')}
          name='ActivityId' >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={__('version')}
          name='Version' >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={__('name')}
          name='Name'
          rules={[{ required: true, message: __('nameTip') }]} >
          <Input />
        </Form.Item>
        <Form.Item
          label={__('playType')}
          name='PlayType'
          rules={[{ required: true, message: __('playTypeTip') }]} >
          <Select>
            <Option value='HomeWork'>{__('homeWork')}</Option>
            <Option value='SoloLive'>{__('soloLive')}</Option>
            <Option value='TeamLive'>{__('teamLive')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={__('accuracy')}
          name='Accuracy' >
          <InputNumber min={0} max={100} formatter={playTypeFormatter} parser={playTypeParser} />
        </Form.Item>
        <Form.Item
          label={__('usersCount')}
          name='UsersCount' >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label={__('questions')}
          name='Questions' >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label={__('createdTime')}
          name='CreatedTime' >
          <DatePicker showTime disabled />
        </Form.Item>
        <Form.Item
          label={__('deadlineTime')}
          name='DeadlineTime'
          rules={[{ required: true, message: __('deadlineTimeTip') }]} >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button loading={commitLoading} type='primary' htmlType='submit'>
            {__('submit')}
          </Button>
          <Button className={theme.cancelBtn} type='ghost' onClick={handleCancel} >
            {__('back')}
          </Button>
        </Form.Item>
      </Form>
    }

    return <div className={theme.assignmentDetail}>
      <Spin spinning={loading}>
        {createForm()}
      </Spin>
    </div>
  }

  AssignmentDetail.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    assignment: PropTypes.object.isRequired,
    getAssignment: PropTypes.func.isRequired,
    editAssignment: PropTypes.func.isRequired,
    setBreadcrumb: PropTypes.func.isRequired,
    multiview_actived: PropTypes.any
  }

  return AssignmentDetail
}

const i18n = (RB_CONTEXT) => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT) => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
