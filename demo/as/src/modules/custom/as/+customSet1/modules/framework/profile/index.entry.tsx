import PropTypes, { InferProps } from 'prop-types'
import React, { useEffect, useState } from 'react'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const antd = await getModule('antd') as ANTD.IANTD
  const { Form, Input, Button, Modal, Spin, message } = antd

  function Profile (props: InferProps<typeof Profile.propTypes>, ref) {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [commitLoading, setCommitLoading] = useState(false)
    const [form] = Form.useForm()
    const { setNotifyHandler, getTeacher, editTeacher, __ } = props
    const AUTH = props.AUTH as AsUtils.IAuth
    const teacher = props.teacher as AsUtils.IUser
    const theme = props.theme as RB.IRBTheme

    const show = ({ visible }) => {
      const getUser = AUTH.role === 'Teacher' ? getTeacher : () => Promise.resolve()
      return new Promise((resolve) => {
        setVisible(visible)
        setLoading(true)
        getUser(AUTH.uid).finally(() => {
          setLoading(false)
          resolve(null)
        })
      })
    }

    setNotifyHandler({
      show
    }, ref)

    useEffect(() => {
      form.setFieldsValue(teacher)
    }, [teacher])

    const handleCancel = () => {
      form.resetFields()

      setVisible(false)
      setCommitLoading(false)
    }

    const handleFinish = (values: TeacherStore.IEditData) => {
      setCommitLoading(true)
      const editUser = AUTH.role === 'Teacher' ? editTeacher : () => Promise.resolve()
      editUser(AUTH.uid, values).then(() => {
        handleCancel()
        setCommitLoading(false)
        message.success(__('success'))
      }).catch((err: Error) => {
        message.error(err.message)
        setCommitLoading(false)
      })
    }

    function createForm () {
      const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
      const tailLayout = {
        wrapperCol: { offset: 6, span: 18 }
      }
      const initialValues = teacher

      return <Form form={form} initialValues={initialValues} {...layout} onFinish={handleFinish} >
        <Form.Item
          label={__('id')}
          name='id' >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={__('userEmail')}
          name='email' >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={__('userType')}
          name='userType' >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={__('userName')}
          name='userName'
          rules={[{ required: true, message: __('userNameTip') }]} >
          <Input />
        </Form.Item>
        <Form.Item
          label={__('address')}
          name='address' >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button loading={commitLoading} type='primary' htmlType='submit'>
            {__('submit')}
          </Button>
        </Form.Item>
      </Form>
    }

    return <Modal className={theme.profileModal} title={__('title')} visible={visible}
      footer={null} maskClosable={false} onCancel={handleCancel}>
      <Spin spinning={loading}>
        {createForm()}
      </Spin>
    </Modal>
  }

  Profile.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    AUTH: PropTypes.object.isRequired,
    teacher: PropTypes.object.isRequired,
    getTeacher: PropTypes.func.isRequired,
    editTeacher: PropTypes.func.isRequired,
    setNotifyHandler: PropTypes.func.isRequired
  }

  return Profile
}
