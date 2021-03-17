import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const antd = await getModule('antd')
  const antdIcon = await getModule('antdIcon')
  const MultiView = await getModule('multiView')
  const AssignmentDetail = await getModule('assignmentDetail')
  const moment = await getModule('moment')
  const { Table } = antd
  const { UnorderedListOutlined } = antdIcon

  function Assignment (props) {
    const { theme, assignments: items, history, getAssignmentList, __ } = props
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      getData(pagination)
    }, [])

    const getData = (pagination) => {
      setLoading(true)
      getAssignmentList(pagination).then(data => {
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
      }, {
        title: __('detail'),
        dataIndex: 'handler',
        render: handleDetail
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

    const handleDetail = (text, record) => {
      return <UnorderedListOutlined onClick={() => { toDetailPage(record) }} />
    }

    const toDetailPage = (record) => {
      const path = `assignment?view=detail&id=${record.id}`
      history.push(path)
    }

    const handleQuestions = (text) => {
      return __('qsText', [text])
    }

    const handleTableChange = (pagination) => {
      getData(pagination)
    }

    const getDateText = (datetime) => {
      return moment(datetime).format('MM/DD/YYYY hh:mm:ss A')
    }

    const handleMultiViewChange = (index, name) => {
      if (index === 0) {
        // refresh list
        getData(pagination)
      }
    }

    const columns = getColumns()
    return <MultiView location={history.location} viewNames={['', 'detail']} onChange={handleMultiViewChange}>
      <div className={theme.wrapper}>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={items}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
      <AssignmentDetail />
    </MultiView>
  }

  Assignment.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    assignments: PropTypes.array.isRequired,
    getAssignmentList: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  return Assignment
}
