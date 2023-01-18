import { exec } from 'child_process'
import { existsSync } from 'fs'

const prettier = './node_modules/.bin/prettier'

export const format = (file: string) => {
  if (!existsSync(prettier) || !existsSync(file)) return
  exec(`${prettier} --write ${file}`)
}
