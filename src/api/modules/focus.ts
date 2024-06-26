import { NoteMock, TableName } from '@/service/model'
import { filterStore } from '@/service/controller'
import { Pagination } from './utils'

type NoteOption = {
  tagId?: number
  categoryId?: number
}
type GetAllNoteOption = NoteOption & Pagination
export async function searchFocusNote(option: GetAllNoteOption) {
  const { pageNo = 0, pageSize = 10, tagId } = option

  const ret = await filterStore<NoteMock>(
    TableName.note,
    (d) => {
      return !!d?.isFocused && !d?.isDeleted && d?.tagId === tagId
    },
    pageNo,
    pageSize
  )

  return ret
}
