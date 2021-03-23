import PropTypes, { InferProps } from 'prop-types'
import React, { useContext, useEffect } from 'react'
import { ReactReduxContext } from 'react-redux'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
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

const i18n = (RB_CONTEXT: RB.IRBContext): RB.IRBI18n => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT: RB.IRBContext): RB.IRBTheme => {
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
