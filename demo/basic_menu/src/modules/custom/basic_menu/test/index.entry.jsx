import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const antd = await getModule('antd')
  const { Button } = antd
  return class Test extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      addItem: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      items: PropTypes.array.isRequired
    }

    handleDelete = (i) => {
      this.props.deleteItem(i)
    }

    handleAdd = () => {
      this.props.addItem({
        name: `he-${Date.now()}`
      })
    }

    createList () {
      const { items = [], __ } = this.props
      return items.map((item, i) => {
        return <div key={i}>
          {item.name}
          <Button onClick={() => { this.handleDelete(i) }}>{__('delete')}</Button>
        </div>
      })
    }

    render () {
      const { __, theme } = this.props
      return <div className={theme.test}>
        <div>
          {__('test')}
        </div>
        <div>
          {this.createList()}
        </div>
        <div>
          <Button onClick={this.handleAdd}>{__('add')}</Button>
        </div>
      </div>
    }
  }
}