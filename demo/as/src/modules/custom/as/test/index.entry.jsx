import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const antd = await getModule('antd')
  const asUtils = await getModule('asUtils')
  const { getDateText } = asUtils
  const { Table } = antd
  function Test (props) {
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const [loading, setLoading] = useState(false)
    const getData = (pagination) => {
      const { getList } = props
      setLoading(true)
      getList(pagination).then(data => {
        setPagination({
          pagination: {
            ...pagination,
            total: data.count
          }
        })
        setLoading(false)
        return data
      }).catch(err => {
        setLoading(false)
        return err
      })
    }

    const getColumns = () => {
      const { __ } = props

      return [{
        title: __('type'),
        dataIndex: 'PlayType',
        render: hanldeType
      }, {
        title: __('name'),
        dataIndex: 'Name'
      }, {
        title: __('questions'),
        dataIndex: 'Questions',
        render: handleQuestions
      }, {
        title: __('totalPlayers'),
        dataIndex: 'UsersCount'
      }, {
        title: __('accuracy'),
        dataIndex: 'accuracy'
      }, {
        title: __('deadline'),
        dataIndex: 'DeadlineTime',
        render: handleDate
      }]
    }

    const hanldeType = (text) => {
      if (text === 'HomeWork') {
        return 'Hw'
      } else {
        return 'Live'
      }
    }

    const handleDate = (text) => {
      const value = text ? getDateText(text * 1000) : ''
      return value
    }

    const handleQuestions = (text) => {
      const { __ } = props
      return __('qsText', [text])
    }

    const handleTableChange = (pagination) => {
      getData(pagination)
    }

    useEffect(() => {
      getData(pagination)
    }, [])

    const { theme, items } = props
    const columns = getColumns()
    return <div className={theme.test}>
      <Table
        columns={columns}
        rowKey={record => record.Id}
        dataSource={items}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    getList: PropTypes.func.isRequired
  }

  return Test
}
