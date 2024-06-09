import { saveStore, getStore, deleteStore, getAllStore } from '@/service/controller'
import { MuCategory, TableName } from '@/service/model'
export async function saveMuCategory({
  val = '未命名分类',
  id = undefined
}: {
  val?: string
  id?: number
}) {
  const ret = await saveStore<MuCategory>(TableName.category, { title: val, id, icon: 'ask1' }, id)
  return ret
}

export async function getMuCategory(id: number) {
  const ret = await getStore<MuCategory>(TableName.category, id)
  return ret
}

export async function getAllMuCategory() {
  const ret = await getAllStore<MuCategory>(TableName.category)
  return ret
}

export async function deleteMuCategory(ids: number[]) {
  const ret = await deleteStore(TableName.category, ids)
  return ret
}
