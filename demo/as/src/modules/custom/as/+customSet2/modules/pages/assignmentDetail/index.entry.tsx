import PropTypes, { InferProps } from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import get from 'lodash/get'
import { useHistory } from 'react-router-dom'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
  const antd = await getModule('antd') as ANTD.IANTD
  const moment = await getModule('moment') as Moment.IMoment
  const { DatePicker, Form, Input, InputNumber, Button, Select, Spin, message } = antd
  const { Option } = Select
  const { getQueryParams } = asUtils

  function AssignmentDetail (props: InferProps<typeof AssignmentDetail.propTypes>) {
    const { getAssignment, editAssignment, __, multiview_actived } = props
    const theme = props.theme as RB.IRBTheme
    const assignment = props.assignment as AssignmentStore.IAssignment
    const setBreadcrumb = props.setBreadcrumb as BreadcrumbStore.ISetBreadcrumb
    const [form] = Form.useForm()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [commitLoading, setCommitLoading] = useState(false)
    const prevPropsRef = useRef<InferProps<typeof AssignmentDetail.propTypes>>()
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

    const getQueryParam = (props: InferProps<typeof AssignmentDetail.propTypes>, key: string) => {
      const search = get(props, 'location.search')
      const query = getQueryParams(search) || {}

      return query[key]
    }

    const handleFinish = (values) => {
      const ret = {
        ...values,
        CreatedTime: Math.floor(values.CreatedTime.valueOf() / 1000),
        DeadlineTime: Math.floor(values.DeadlineTime.valueOf() / 1000)
      }

      setCommitLoading(true)
      const id = getQueryParam(props, 'id')
      editAssignment(id, ret).then(() => {
        handleCancel()
        setCommitLoading(false)
        message.success(__('success'))
      }).catch(err => {
        message.error(err.message)
        setCommitLoading(false)
      })
    }

    const getDetail = (id: string) => {
      setLoading(true)
      getAssignment(id).finally(() => {
        setLoading(false)
      })
    }

    const playTypeFormatter = (value: number|null|undefined|'') => {
      if (!value) {
        value = 0
      }
      return `${value}%`
    }

    const playTypeParser = (value: string) => {
      return value.replace('%', '')
    }

    const handleValues = (values: AssignmentStore.IAssignment) => {
      const ret = {
        ...values,
        CreatedTime: moment((values.CreatedTime || 0) * 1000),
        DeadlineTime: moment((values.DeadlineTime || 0) * 1000)
      }

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
