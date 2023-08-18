import { exec } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

const prettier = path.resolve('./node_modules/.bin/prettier')

export const format = (file: string) => {
  if (!existsSync(prettier) || !existsSync(file)) return
  exec(`${prettier} --write --cache ${file}`)
}
