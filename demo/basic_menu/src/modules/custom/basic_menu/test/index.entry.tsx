import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const antd = await getModule('antd') as ANTD.IANTD
  const { Button } = antd
  function Test (props: InferProps<typeof Test.propTypes>) {
    const { deleteItem, addItem, items = [], __ } = props
    const theme = props.theme as RB.IRBTheme
    const handleDelete = (i: number) => {
      deleteItem(i)
    }

    const handleAdd = () => {
      addItem({
        name: `he-${Date.now()}`
      })
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
      </div>
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired
  }

  return Test
}
