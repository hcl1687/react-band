import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = async ({ getModule }) => {
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
        setVisible(visible)
        resolve()
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
      const { login, getTeacher } = props
      setLoading(true)
      login(values).then((auth) => {
        const getUser = auth.role === 'Teacher' ? getTeacher : Promise.resolve()
        return getUser(auth.uid)
      }).then(() => {
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
      const initialValues = {
        email: 'test@hcl1687.com',
        password: '123456'
      }

      return <Form ref={formRef} initialValues={initialValues} {...layout} onFinish={handleFinish} >
        <Form.Item
          label={__('userEmail')}
          name='email'
          rules={[{ required: true, message: __('emailTip') }, { type: 'email', message: __('invalidEmail') }]} >
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
    getTeacher: PropTypes.func.isRequired,
    setNotifyHandler: PropTypes.func.isRequired
  }

  return Login
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
