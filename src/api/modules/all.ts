import { Note, Tables } from '@/service/model'
import { saveStore, deleteStore, filterStore, getAllStore } from '@/service/controller'
import { Pagination } from './utils'

type NoteOption = {
  tagId?: number
  categoryId?: number
}
type GetAllNoteOption = NoteOption & Pagination
export async function searchNote(option: GetAllNoteOption) {
  const { tagId, categoryId, pageNo = 0, pageSize = 10 } = option

  const ret = await filterStore<Note>(
    Tables.note,
    (d) => d?.tagId === tagId && d?.categoryId === categoryId && !d?.isDeleted,
    pageNo,
    pageSize
  )
  return ret
}

type SaveNote = Note & {
  id?: number
  content?: string
}
export async function saveNote(option: SaveNote) {
  await saveStore<Note>(Tables.note, option, option?.id)
}

export async function deleteNote(ids: number[], isTrue = false) {
  if (isTrue) {
    const ret = await deleteStore(Tables.note, ids)
    return ret
  } else {
    await saveNote({
      id: ids[0],
      isDeleted: true
    })
  }
}

export async function getAllNote() {
  return await getAllStore<Note>(Tables.note)
}
