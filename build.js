const path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec

const src = path.resolve(__dirname, './src')
const src_build = path.resolve(__dirname, './src_build')
async function build () {
  try {
    await fs.emptyDir(src_build)
    console.log('copy src to src_build.')
    await fs.copy(src, src_build, {
      filter: (src, dest) => {
        // do not copy test files
        if (/__tests__/.test(src)) {
          return false
        }
  
        return true
      }
    })
    
    console.log('compile src_build.')
    await promiseExec('npm run compile', './')
    console.log('remove src_build')
    await fs.remove(src_build)
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

build()
