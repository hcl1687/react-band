import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async ({ getComponent }) => {
  const antd = await getComponent('antd')
  const { Form, Input, Button, Modal } = antd
  return class Login extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      AUTH: PropTypes.object,
      login: PropTypes.func.isRequired
    }

    constructor (props, context) {
      super(props, context)
      this.state = {
        visible: false,
        errMsg: '',
        loading: false
      }

      this.formRef = React.createRef()
    }

    setLoading (loading) {
      this.setState({
        loading
      })
    }

    show = ({ visible }) => {
      return new Promise((resolve) => {
        this.setState({
          visible
        }, () => {
          resolve()
        })
      })
    }

    handleCancel = () => {
      if (this.formRef && this.formRef.current) {
        this.formRef.current.resetFields()
      }

      this.setState({
        visible: false,
        loading: false,
        errMsg: ''
      })
    }

    handleFinish = (values) => {
      const { login } = this.props
      this.setLoading(true)
      login(values).then(() => {
        this.handleCancel()
        this.setLoading(false)
      }).catch(err => {
        this.setState({
          errMsg: err.message,
          loading: false
        })
      })
    }

    createForm () {
      const { __, theme } = this.props
      const { loading, errMsg } = this.state
      const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
      const tailLayout = {
        wrapperCol: { offset: 6, span: 18 }
      }

      return <Form ref={this.formRef} {...layout} name='basic' onFinish={this.handleFinish}
        onFinishFailed={this.handleFinishFailed}>
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

    render () {
      const { theme, __ } = this.props
      const { visible } = this.state

      return <Modal className={theme.loginModal} title={__('loginTitle')} visible={visible}
        footer={null} maskClosable={false} onCancel={this.handleCancel}>
        {this.createForm()}
      </Modal>
    }
  }
}
