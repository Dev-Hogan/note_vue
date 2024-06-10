import { supabase } from './base'
import { TableName } from './type'
import { Tables } from './supabase'
import { omitBy, isNaN } from 'lodash'
export function NotNull<T extends Tables<TableName>>(val: T, table: TableName) {
  const obj = omitBy(val, isNaN) as T
  const query = supabase.from(table).select('*')
  const notNullList = Object.entries(obj)
  if (notNullList && notNullList.length > 0) {
    for (let i = 0; i < notNullList.length; i++) {
      // query = query.eq(notNullList[i][0], notNullList[i][1])
      query
    }
  }
}
