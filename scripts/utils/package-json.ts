import * as fs from 'fs'
import * as pathlib from 'path'
import * as prettier from 'prettier'
import * as consts from '../constants'

type Package = {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

namespace objects {
  export const keys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[]
}

const absPackageJson = (relativePath: string) => {
  const absolutePath = pathlib.resolve(consts.ROOT_DIR, relativePath)
  return pathlib.join(absolutePath, 'package.json')
}

export const readPackage = (relativePath: string): Package => {
  const absolutePackageJson = absPackageJson(relativePath)
  const packageContent = fs.readFileSync(absolutePackageJson, 'utf-8')
  const packageJson = JSON.parse(packageContent)
  return packageJson
}

export const isPackage = (relativePath: string): boolean => {
  const absolutePackageJson = absPackageJson(relativePath)
  return fs.existsSync(absolutePackageJson)
}

export const writePackage = (relativePath: string, pkg: Package) => {
  const absolutePackageJson = absPackageJson(relativePath)
  let content = JSON.stringify(pkg, null, 2)
  content = prettier.format(content, { parser: 'json' })
  fs.writeFileSync(absolutePackageJson, content)
}

export const updatePackage = (relativePath: string, pkg: Partial<Package>) => {
  const currentPackage = readPackage(relativePath)

  // this preserves the order of the keys
  const newPackage = objects.keys(currentPackage).reduce((acc, key) => {
    if (key in pkg) {
      return { ...acc, [key]: pkg[key] }
    }
    return acc
  }, currentPackage)

  writePackage(relativePath, newPackage)
}