const path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec

const src = path.resolve(__dirname, './src')
const src_bak = path.resolve(__dirname, './src_bak')
async function build () {
  try {
    await fs.remove(src_bak)
    console.log('move src to src_bak')
    await renameFolder(src, src_bak)
    console.log('create temp src for build.')
    await fs.copy(src_bak, src, {
      filter: (src, dest) => {
        // do not copy test files
        if (/__tests__/.test(src)) {
          return false
        }
  
        return true
      }
    })
    
    console.log('compile temp src.')
    await promiseExec('npm run compile', './')
    console.log('remove temp src')
    await fs.remove(src)
    console.log('restore src')
    await renameFolder(src_bak, src)
    console.log('build done.')
  } catch (e) {
    console.log(e)
  }
}

function promiseExec (cmd, cwd) {
  return new Promise((resolve, reject) => {
    const execHandler = exec(cmd, { cwd }, function (error, stdout, stderr) {
      if (error) {
        console.log(stderr)
        reject(stderr)
        return
      }

      resolve()
    })

    execHandler.stdout.pipe(process.stdout)
  })
}

function renameFolder (oldName, newName) {
  return new Promise((resolve, reject) => {
    fs.rename(oldName, newName, (err) => {
      if(err) {
        reject(err)
        return
      }
  
      resolve()
    })
  })
}

build()
