import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const antd = await getModule('antd')
  const { Form, Input, Button, Modal } = antd

  function Login (props, ref) {
    const [visible, setVisible] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const formRef = useRef(null)
    const { setNotifyHandler } = props

    const show = ({ visible }) => {
      return new Promise((resolve) => {
        setVisible(visible, () => {
          resolve()
        })
      })
    }

    setNotifyHandler({
      show
    }, ref)

    const handleCancel = () => {
      if (formRef && formRef.current) {
        formRef.current.resetFields()
      }

      setVisible(false)
      setLoading(false)
      setErrMsg('')
    }

    const handleFinish = (values) => {
      const { login } = props
      setLoading(true)
      login(values).then(() => {
        handleCancel()
        setLoading(false)
      }).catch(err => {
        setErrMsg(err.message)
        setLoading(false)
      })
    }

    function createForm () {
      const { __, theme } = props
      const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
      const tailLayout = {
        wrapperCol: { offset: 6, span: 18 }
      }

      return <Form ref={formRef} {...layout} name='basic' onFinish={handleFinish} >
        <Form.Item
          label={__('userName')}
          name='name'
          rules={[{ required: true, message: __('nameTip') }]} >
          <Input />
        </Form.Item>
        <Form.Item
          label={__('password')}
          name='password'
          rules={[{ required: true, message: __('passwordTip') }]} >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button loading={loading} type='primary' htmlType='submit'>
            {__('submit')}
          </Button>
        </Form.Item>
        {
          errMsg ? <Form.Item {...tailLayout}>
            <div className={theme.error}>{__(errMsg)}</div>
          </Form.Item> : null
        }
      </Form>
    }

    const { theme, __ } = props
    return <Modal className={theme.loginModal} title={__('loginTitle')} visible={visible}
      footer={null} maskClosable={false} onCancel={handleCancel}>
      {createForm()}
    </Modal>
  }

  Login.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    setNotifyHandler: PropTypes.func.isRequired
  }

  return Login
}
