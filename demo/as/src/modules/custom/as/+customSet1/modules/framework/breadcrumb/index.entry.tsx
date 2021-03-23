import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import { useHistory } from 'react-router-dom'
import zhCN from './i18n/zh-CN.json'

const entry = async (): Promise<RB.IRBComponent> => {
  function Breadcrumb (props: InferProps<typeof Breadcrumb.propTypes>) {
    const { className = '', BREADCRUMBS: crumbs = [] } = props
    const theme = props.theme as RB.IRBTheme
    const history = useHistory()

    const handleClick = (i: number) => {
      if (i === crumbs.length - 1) {
        // if it is the last crumb, do nothing.
        return
      }

      const crumb = crumbs[i]
      const { path, onClick } = crumb
      if (onClick) {
        onClick()
        return
      }

      history.push(path)
    }

    const createPathsLink = () => {
      const links = []
      const lastIndex = crumbs.length - 1
      crumbs.forEach((item, i) => {
        const { name } = item
        links.push(<span key={`item-${i}`} className={theme.item} title={name} onClick={() => { handleClick(i) }}>
          {name}
        </span>)
        if (i !== lastIndex) {
          links.push(<span key={`sep-${i}`} className={theme.sep} />)
        }
      })

      return links
    }

    return crumbs.length > 1 ? <div className={classnames('breadcrumb', theme.breadcrumb, className)}>
      {createPathsLink()}
    </div> : null
  }

  Breadcrumb.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.object.isRequired,
    BREADCRUMBS: PropTypes.array.isRequired
  }

  return Breadcrumb
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
