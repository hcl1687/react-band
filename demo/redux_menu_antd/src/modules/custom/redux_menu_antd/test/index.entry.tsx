import PropTypes, { InferProps } from 'prop-types'
import React, { useContext, useEffect } from 'react'
import { ReactReduxContext } from 'react-redux'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const antd = await getModule('antd') as ANTD.IANTD
  const { Button } = antd
  function Test (props: InferProps<typeof Test.propTypes>) {
    const { deleteItem, addItem, LEFT_STATUS, showLeft, items = [], __ } = props
    const reduxContext: ReactReduxContext = useContext(ReactReduxContext)
    const theme = props.theme as RB.IRBTheme

    useEffect(() => {
      const storeState = reduxContext.store.getState()
      console.log(storeState)
    }, [])

    const handleDelete = (i) => {
      deleteItem(i)
    }

    const handleAdd = () => {
      addItem({
        name: `he-${Date.now()}`
      })
    }

    const toogleMenu = () => {
      showLeft(!LEFT_STATUS)
    }

    const createList = () => {
      return items.map((item, i) => {
        return <div key={i}>
          {item.name}
          <Button onClick={() => { handleDelete(i) }}>{__('delete')}</Button>
        </div>
      })
    }

    return <div className={theme.test}>
      <div>
        {__('test')}
      </div>
      <div>
        {createList()}
      </div>
      <div>
        <Button onClick={handleAdd}>{__('add')}</Button>
        <Button onClick={toogleMenu}>{__('toggle')}</Button>
      </div>
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    showLeft: PropTypes.func.isRequired,
    LEFT_STATUS: PropTypes.bool.isRequired
  }

  return Test
}
