/**
 * @module @mattduffy/calories
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @summary Post-install script to copy single-file module into webroot.
 * @file src/postinstall.js
 */

import { resolve } from 'node:path'
import { stat, symlink } from 'node:fs/promises'

console.log('postinstall script')
console.log(process.cwd())
const rootDir = process.cwd()
const jsDir = 'public/j/'
// const jsDir = 'test/'
const jsPath = resolve(rootDir, jsDir)
const moduleFile = resolve(rootDir, 'node_modules', '@mattduffy/calories', 'src/index.js')
console.log(jsPath, moduleFile)
let exists = true
let linked
try {
  exists = await stat(jsPath, { throwIfNoEntry: false })
  linked = await symlink(moduleFile, `${jsPath}/calories.js`)
} catch (err) {
  if (err.code === 'ENOENT') {
    exists = false
  }
  linked = false
}
console.log('js directory exists?', exists)
console.log('is file linked?', linked)
