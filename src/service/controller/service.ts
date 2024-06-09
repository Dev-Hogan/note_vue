import { db } from './db'
import { TableName, SearchParameters } from '../model'
import dayjs from 'dayjs'

export async function saveStore<
  T extends {
    createTime?: string
    updateTime?: string
  }
>(tableName: TableName, datas: T, id?: number) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  if (id) {
    const ret = await db.table(tableName).update(id, { ...datas, updateTime: now })
    return ret
  } else {
    const ret = await db.table(tableName).add({ ...datas, createTime: now })
    return ret
  }
}

export async function deleteStore(tableName: TableName, ids: number[]) {
  const ret = await db.table(tableName).bulkDelete(ids)
  return ret
}

export async function getStore<T>(tableName: TableName, key: number) {
  const ret = await db.table(tableName).get(key)
  return ret as T
}

export async function getAllStore<T>(tableName: TableName) {
  const ret = await db.table(tableName).toArray()
  return ret as T[]
}

export async function filterStore<T>(
  tableName: TableName,
  filterHelper: (val?: T) => boolean = () => true,
  pageNo = 0,
  pageSize = 10
) {
  const ret = await db
    .table(tableName)
    .orderBy('id')
    .filter(filterHelper)
    .offset(pageNo * pageSize)
    .limit(pageSize)
    .toArray()
  return ret as T[]
}
export async function searchStore<T>(tableName: TableName, p?: SearchParameters<T>, all = false) {
  const fuzzyQuery = (d: any, KV: [string, any][]) => {
    for (const [key, value] of KV) {
      const reg = new RegExp(value)
      return reg.test(d[key])
    }
    return false
  }
  // let rootEntries: [string, any][] = []
  let entityEntries: [string, any][] = []
  if (p?.entity) {
    entityEntries = Object.entries(p.entity)
  }
  // if (p?.root) {
  //   rootEntries = Object.entries(p.root)
  // }

  const entityQuery = (d: any, KV: [string, any][]) => {
    const map = KV.map((k) => d[k[0]] == k[1] || k[1] == null)
    return map.some((v) => !!v)
  }
  const equalCollection = await db.table(tableName).filter((d) => {
    // if (rootEntries.length > 0) {
    //   return fuzzyQuery(d, rootEntries)
    // }
    if (entityEntries.length > 0) {
      return entityQuery(d, entityEntries)
    }
    return true
  })

  if (all) {
    return (await equalCollection.toArray()) as T[]
  }

  return (await equalCollection
    .offset(p?.pageNo || 0 * (p?.pageSize || 10))
    .limit(p?.pageSize || 10)
    .toArray()) as T[]
}
/**获取字符数量 */
export async function getCount(tableName: TableName) {
  const ret = await db.table(tableName).get('count')
  const ret2 = await db.table(tableName).get('updateTime')
  return {
    countNum: ret,
    countNumDay: ret2
  }
}
