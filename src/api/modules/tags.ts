import { TagMock, TableName, SearchParameters } from '@/service/model'
import { saveStore, getStore, deleteStore, getAllStore, searchStore } from '@/service/controller'
import { supabase } from '../supbaseAPI'

export async function getAllTags() {
  const ret = await getAllStore<TagMock>(TableName.tag)
  return ret
}

export async function getTag(id: number) {
  const ret = await getStore<TagMock>(TableName.tag, id)
  return ret
}

export async function deleteTag(ids: number[]) {
  const ret = await deleteStore(TableName.tag, ids)
  return ret
}

export async function saveTag(option: TagMock) {
  const ret = await saveStore<TagMock>(TableName.tag, option, option?.id)
  return ret
}

export async function searchTag(option?: SearchParameters<TagMock>, all = false) {
  const ret = await searchStore<TagMock>(TableName.tag, option, all)
  return ret
}

export async function getTagsAPI() {
  const { data } = await supabase.from('tag').select()
  return data
}

export async function addTagAPI(name: string) {
  const {} = await supabase.from('tag').insert([{ name }])
}
