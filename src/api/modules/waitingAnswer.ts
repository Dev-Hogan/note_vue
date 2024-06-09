import { NoteMock, TableName } from '@/service/model'
import { filterStore } from '@/service/controller'
import { Pagination } from './utils'

type NoteOption = {
  tagId?: number
  categoryId?: number
}
type GetAllNoteOption = NoteOption & Pagination
export async function searchWaitingNote(option: GetAllNoteOption) {
  const { pageNo = 0, pageSize = 10, tagId } = option

  const ret = await filterStore<NoteMock>(
    TableName.note,
    (d) => {
      return !!d?.isWaiting && d?.tagId === tagId && !!d?.isDeleted
    },
    pageNo,
    pageSize
  )

  return ret
}
