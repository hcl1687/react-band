import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const antd = await getModule('antd')
  const asUtils = await getModule('asUtils')
  const { getDateText } = asUtils
  const { Table } = antd
  return class Test extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      items: PropTypes.array.isRequired,
      getList: PropTypes.func.isRequired
    }

    constructor (props, context) {
      super(props, context)

      this.state = {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        loading: false
      }
    }

    componentDidMount () {
      const { pagination } = this.state
      this.getData(pagination)
    }

    setLoading (loading) {
      this.setState({
        loading
      })
    }

    getData (pagination) {
      const { getList } = this.props
      this.setLoading(true)
      getList(pagination).then(data => {
        this.setState({
          pagination: {
            ...pagination,
            total: data.count
          },
          loading: false
        })
        return data
      }).catch(err => {
        this.setLoading(false)
        return err
      })
    }

    getColumns () {
      const { __ } = this.props

      return [{
        title: __('type'),
        dataIndex: 'PlayType',
        render: this.hanldeType
      }, {
        title: __('name'),
        dataIndex: 'Name'
      }, {
        title: __('questions'),
        dataIndex: 'Questions',
        render: this.handleQuestions
      }, {
        title: __('totalPlayers'),
        dataIndex: 'UsersCount'
      }, {
        title: __('accuracy'),
        dataIndex: 'accuracy'
      }, {
        title: __('deadline'),
        dataIndex: 'DeadlineTime',
        render: this.handleDate
      }]
    }

    hanldeType = (text) => {
      if (text === 'HomeWork') {
        return 'Hw'
      } else {
        return 'Live'
      }
    }

    handleDate = (text) => {
      const value = text ? getDateText(text * 1000) : ''
      return value
    }

    handleQuestions = (text) => {
      const { __ } = this.props
      return __('qsText', [text])
    }

    handleTableChange = (pagination) => {
      this.getData(pagination)
    }

    render () {
      const { theme, items } = this.props
      const { pagination, loading } = this.state
      const columns = this.getColumns()
      return <div className={theme.test}>
        <Table
          columns={columns}
          rowKey={record => record.Id}
          dataSource={items}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
      </div>
    }
  }
}
