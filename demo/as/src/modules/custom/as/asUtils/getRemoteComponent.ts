import flowFactory from 'promiseflow'
import isArray from 'lodash/isArray'

const runFlow = flowFactory(Promise)
const errorPrefix = 'getRemoteComponent - '

/**
 * cache all remote compoents
 *
 * {
 *   'cannonEditor': {
 *     state: 'unload' // unload,loading,loaded,failed,
 *     component: object | undefined,
 *     subscribes: []
 *   }
 * }
 */
const REMOTE_COMPS = {}

/**
 * get remote react component.
 *
 * @param {*} componentInfo
 * {
 *   name: ''  // component's name. [package.json][name]
 *   version: ''  // component's version. [package.json][version]
 *   description: ''  // component's description. [package.json][description]
 *   libraryName: ''  // component's library name. [webpack.config.js][output.library]
 *   externals: {}  // component's excluding dependencies. [webpack.config.js][externals]
 *   entries: [] | {} // componet's compiled entry files. such as ['index.css', 'index.js'] or { js1: 'index.js', css1: 'index.css' }
 *   path: ''  // The path to fetch component's files.
 * }
 * @param {*} dependencies A dependencies Object provided to component for instancing.
 * such as
 * {
 *   react: React,
 *   'react-dom': ReactDOM
 * }
 */
export default function getRemoteComponent (
  componentInfo: AsUtils.IComponentInfo = {}, dependencies: AsUtils.IDependencies = {}
): Promise<any> {
  const { name, libraryName, externals = {}, path = '', entries, version = '' } = componentInfo
  const entriesIsArray = isArray(entries)

  if (!name) {
    return Promise.reject(new Error(`${errorPrefix}Name is required.`))
  }

  if (!libraryName) {
    return Promise.reject(new Error(`${errorPrefix}libraryName is required.`))
  }

  if (!path) {
    return Promise.reject(new Error(`${errorPrefix}path is required.`))
  }

  const hasEntries = entriesIsArray ? entries.length > 0 : Object.keys(entries).length > 0
  if (!hasEntries) {
    return Promise.reject(new Error(`${errorPrefix}entries is required.`))
  }

  // check dependencies
  const keys = Object.keys(externals).filter(key => !dependencies[key])
  if (keys.length > 0) {
    return Promise.reject(new Error(`${errorPrefix}Need dependencies: ${keys.join(',')}.`))
  }

  // attach dependencies to window object
  Object.keys(externals).forEach(key => {
    const rootName = externals[key]['root']
    if (!window[rootName]) {
      window[rootName] = dependencies[key]
    }
  })

  if (!REMOTE_COMPS[libraryName]) {
    REMOTE_COMPS[libraryName] = {
      state: 'unload',
      component: undefined,
      subscribes: []
    }
  }

  const compObj = REMOTE_COMPS[libraryName]

  if (compObj.state === 'loaded') {
    return Promise.resolve(compObj.component)
  }

  // if is loading, reigister a funciton to subscribe the component
  if (compObj.state === 'loading') {
    return new Promise((resolve, reject) => {
      compObj.subscribes.push((err: Error, comp: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(comp)
        }
      })
    })
  }

  // load files
  const callback = (val: string|AsUtils.IObject) => {
    if (typeof val === 'string') {
      let src = path[path.length - 1] === '/' ? `${path}${val}` : `${path}/${val}`

      if (version) {
        src += src.includes('?') ? `&v=${version}` : `?v=${version}`
      }

      return () => {
        if (/(\.css$|\.css\?)/.test(src)) {
          return loadCss(name, src)
        } else if (/(\.js$|\.js\?)/.test(src)) {
          return loadScript(name, src)
        }

        return Promise.resolve()
      }
    }

    return val
  }

  compObj.state = 'loading'
  compObj.component = undefined

  return runFlow(entries, '', callback).then(() => {
    const lib = window[libraryName] || {}
    const comp = lib['default'] || lib

    compObj.state = 'loaded'
    compObj.component = comp
    // public
    if (compObj.subscribes && compObj.subscribes.length > 0) {
      compObj.subscribes.forEach((fun: AsUtils.ISubscribeFun) => {
        fun(null, comp)
      })
      compObj.subscribes = []
    }

    return comp
  }).catch((err: Error) => {
    compObj.state = 'failed'
    compObj.component = undefined

    // public
    if (compObj.subscribes && compObj.subscribes.length > 0) {
      compObj.subscribes.forEach((fun: AsUtils.ISubscribeFun) => {
        fun(err)
      })
      compObj.subscribes = []
    }

    throw err
  })
}

// expose createScript for unit test's mocking.
getRemoteComponent.createScript = ({ id, src, onload, onerror }) => {
  const scriptDom = document.createElement('script')
  scriptDom.id = id
  scriptDom.onload = () => {
    scriptDom.onload = null
    scriptDom.onerror = null
    onload()
  }
  scriptDom.onerror = () => {
    scriptDom.onload = null
    scriptDom.onerror = null
    onerror()
  }
  scriptDom.src = src

  document.getElementsByTagName('head')[0].appendChild(scriptDom)

  return scriptDom
}

function getFileNameFromUrl (url = '') {
  // https://goolge.com/abc/efg/hij.js => hij.js
  return url.replace(/(.*\/)([^/]+)$/, ($1, $2, $3) => ($3))
}

function loadScript (name: string, src: string) {
  const fileName = getFileNameFromUrl(src)
  const hash = hashCode(src)
  const id = `${name}/${fileName}/${hash}`

  const scriptDom = document.getElementById(id)
  if (scriptDom) {
    scriptDom.parentNode.removeChild(scriptDom)
  }

  return new Promise((resolve, reject) => {
    const onload = () => {
      resolve(null)
    }
    const onerror = () => {
      reject(new Error(`${errorPrefix}${id} load failed`))
    }

    getRemoteComponent.createScript({
      id, src, onload, onerror
    })
  })
}

function loadCss (name: string, src: string) {
  const fileName = getFileNameFromUrl(src)
  const hash = hashCode(src)
  const id = `${name}/${fileName}/${hash}`

  let link: HTMLLinkElement = document.getElementById(id) as HTMLLinkElement
  if (link) {
    link.parentNode.removeChild(link)
  }

  link = document.createElement('link') as HTMLLinkElement
  link.id = id
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.media = 'all'
  link.href = src
  document.getElementsByTagName('head')[0].appendChild(link)
  return Promise.resolve()
}

function hashCode (str: string) {
  str = str || ''
  let hash = 0
  let i: number
  let chr: number
  if (str.length === 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
