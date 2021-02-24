import PropTypes, { InferProps } from 'prop-types'
import React, { useEffect, useState } from 'react'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const antd = await getModule('antd') as ANTD.IANTD
  const antdIcon = await getModule('antdIcon') as AntdIcon.IAntdIcon
  const MultiView = await getModule('multiView') as RB.IRBComponent
  const AssignmentDetail = await getModule('assignmentDetail') as RB.IRBComponent
  const moment = await getModule('moment') as Moment.IMoment
  const { Table } = antd
  const { UnorderedListOutlined } = antdIcon

  function Assignment (props: InferProps<typeof Assignment.propTypes>) {
    const { assignments: items, getAssignmentList, __ } = props
    const theme = props.theme as RB.IRBTheme
    const history = props.history as RB.IRBHistory
    const [pagination, setPagination] = useState<Assignment.IPaginationState>({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      getData(pagination)
    }, [])

    const getData = (pagination: AssignmentStore.IGetListParams) => {
      setLoading(true)
      getAssignmentList(pagination).then((data: AssignmentStore.IGetListData) => {
        setPagination({
          ...pagination,
          total: data.count
        })
        setLoading(false)
        return data
      }).catch((err: Error) => {
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

    const hanldeType = (text: string) => {
      if (text === 'HomeWork') {
        return 'Hw'
      } else {
        return 'Live'
      }
    }

    const handleDate = (text: number|null) => {
      const value = typeof text === 'number' ? getDateText(text * 1000) : ''
      return value
    }

    const handleDetail = (text: string, record: AssignmentStore.IAssignment) => {
      return <UnorderedListOutlined onClick={() => { toDetailPage(record) }} />
    }

    const toDetailPage = (record: AssignmentStore.IAssignment) => {
      const path = `assignment?view=detail&id=${record.id}`
      history.push(path)
    }

    const handleQuestions = (text: string) => {
      return __('qsText', [text])
    }

    const handleTableChange = (pagination: Assignment.IPaginationState) => {
      getData(pagination)
    }

    const getDateText = (datetime: number) => {
      return moment(datetime).format('MM/DD/YYYY hh:mm:ss A')
    }

    const handleMultiViewChange = (index: number) => {
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
