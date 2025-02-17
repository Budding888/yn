import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import { BIN_DIR } from './constant'

const binPath = path.join(BIN_DIR, os.platform() + '-pandoc-2.7.3' + (os.platform() === 'win32' ? '.exe' : ''))

const convert = async (html: string, type: string) => {
  console.log(binPath)
  try {
    const path = os.tmpdir() + `/yn_convert_${new Date().getTime()}.${type}`

    return new Promise((resolve, reject) => {
      const process = spawn(binPath, ['-f', 'html', '-o', path])

      process.on('close', () => {
        try {
          const data = fs.readFileSync(path)
          fs.unlinkSync(path)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })

      process.on('error', error => {
        reject(error)
      })

      process.stdin.write(html)
      process.stdin.end()
    })
  } catch (e) {
    return e.message
  }
}

export default convert
