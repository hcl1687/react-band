import PropTypes, { InferProps } from 'prop-types'
import React, { cloneElement, useEffect, useRef } from 'react'
import classnames from 'classnames'
import get from 'lodash/get'

const entry = async ({ getModule }: RB.IRBContext): Promise<RB.IRBComponent> => {
  const asUtils = await getModule('asUtils')
  const { getQueryParams } = asUtils as AsUtils.IUtils

  function MultiView (props: InferProps<typeof MultiView.propTypes>) {
    const { className, children, location, viewField = 'view', viewNames = [], onChange } = props
    const prevPropsRef = useRef<InferProps<typeof MultiView.propTypes>>()
    useEffect(() => {
      prevPropsRef.current = props
    })
    const prevProps = prevPropsRef.current || {}

    const getView = (location = {}) => {
      const search = get(location, 'search')
      const query = getQueryParams(search)
      const name = get(query, `${viewField}`)
      let view = name
      if (viewNames.length === 0) {
        view = +view || 0
      } else {
        view = viewNames.indexOf(view)
        if (view === -1) {
          view = 0
        }
      }

      return {
        view,
        name
      }
    }

    const handleChange = (index: number, name: string, opts: RB.IRBObject) => {
      onChange && onChange(index, name, opts)
    }

    useEffect(() => {
      const { location: oldLocation = {} } = prevProps
      const { location = {} } = props
      const { view: preView, name: preName } = getView(oldLocation)
      const { view, name } = getView(location)
      if (view !== preView) {
        handleChange(view, name, {
          preView,
          preName
        })
      }
    })

    const { view } = getView(location)
    const childArray = React.Children.toArray(children)

    return <div className={classnames('multiview', className)}>
      {
        childArray.map((child: React.ReactElement, index) => {
          const display = view === index ? 'block' : 'none'
          const multiview_actived = view === index ? 'true' : 'false'
          return <div key={index} className='multiview-item' style={{ display }}>
            {cloneElement(child, { location, multiview_actived })}
          </div>
        })
      }
    </div>
  }

  MultiView.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    location: PropTypes.object,
    viewField: PropTypes.string,
    viewNames: PropTypes.array,
    onChange: PropTypes.func
  }

  return MultiView
}

export default {
  entry
}
