import {
  forEach,
  isArray,
  isNil,
  isObject,
  isString,
  split,
  startsWith,
  trimStart,
} from 'lodash'
import {
  IKeys,
  IKeysInfo,
  IMapInfinityOptions,
  IMapInfoPayload,
  IStringMapOption,
} from './types'

const TIL_INFINITY = -1
export const stringMap = (
  keyName: string,
  keyInfo: IKeysInfo = {},
  options: IStringMapOption = {},
): string => {
  const {startKey = '$', separator = '/'} = options
  const _keyName = keyName
  // only start with startKey is checked
  if(startsWith(_keyName, startKey)){
    const name: string = trimStart(_keyName, startKey)
    const paths: string[] = split(name, separator)
    let currentKey: any = keyInfo
    forEach(paths, (path: string) => {
      currentKey = currentKey[path]
      if(isNil(currentKey)){return false}
    })
    // If find current key
    if(isString(currentKey)){
      return currentKey
    }
    return name
  }
  return keyName
}

// export const mapAll = (
//   keys: IKeys,
//   mapInfo: IMapInfoPayload,
//   options: IStringMapOption = {},
// ): IKeys => {
//   const resultKeys: IKeys = {}
//   const {keyInfo = {}, valueInfo = {}} = mapInfo
//   forEach(keys, (item: string, key: string) => {
//     resultKeys[stringMap(key, keyInfo, options)] = stringMap(item, valueInfo, options)
//   })
//   return resultKeys
// }

const mapInfinity = (
  keys: IKeys,
  mapInfo: IMapInfoPayload,
  options: IMapInfinityOptions = {},
): IKeys => {
  const resultKeys: IKeys = {}
  const {til = TIL_INFINITY} = options
  forEach(keys, (value, key) => {
    const {keyInfo = {}, valueInfo = {}} = mapInfo
    const mappedKey = stringMap(key, keyInfo, options)
    let myItem = value
    if((isObject(value) || isArray(value)) && til !== 0){
      myItem = mapInfinity(myItem as IKeys, mapInfo, {...options, til: til - 1})
    }else if(isString(value)){
      myItem = stringMap(value, valueInfo, options)
    }
    resultKeys[mappedKey] = myItem
  })
  return resultKeys
}
export default mapInfinity