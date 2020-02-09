import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default () => {
  return class Test extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      addItem: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      items: PropTypes.array.isRequired,
      showLeft: PropTypes.func.isRequired,
      LEFT_STATUS: PropTypes.bool.isRequired
    }

    handleDelete = (i) => {
      this.props.deleteItem(i)
    }

    handleAdd = () => {
      this.props.addItem({
        name: `he-${Date.now()}`
      })
    }

    toogleMenu = () => {
      const { LEFT_STATUS, showLeft } = this.props
      showLeft(!LEFT_STATUS)
    }

    createList () {
      const { items = [] } = this.props
      return items.map((item, i) => {
        return <div key={i}>
          {item.name}
          <button onClick={() => { this.handleDelete(i) }}>delete</button>
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
          <button onClick={this.handleAdd}>add</button>
          <button onClick={this.toogleMenu}>Toogle Menu</button>
        </div>
      </div>
    }
  }
}
