import { Note, TableName } from '@/service/model'
import { filterStore } from '@/service/controller'
import { Pagination } from './utils'

type NoteOption = {
  tagId?: number
  categoryId?: number
}
type GetAllNoteOption = NoteOption & Pagination
export async function searchTrashNote(option: GetAllNoteOption) {
  const { pageNo = 0, pageSize = 10, tagId } = option

  const ret = await filterStore<Note>(
    TableName.note,
    (d) => {
      return !!d?.isDeleted && d?.tagId === tagId
    },
    pageNo,
    pageSize
  )

  return ret
}
