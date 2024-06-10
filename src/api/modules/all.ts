import { NoteMock, TableName } from '@/service/model'
import { saveStore, deleteStore, filterStore, getAllStore } from '@/service/controller'
import { Pagination } from './utils'
import { supabase, Note } from '../supbaseAPI'

type NoteOption = {
  tagId?: number
  categoryId?: number
}
type GetAllNoteOption = NoteOption & Pagination
export async function searchNote(option: GetAllNoteOption) {
  const { tagId, categoryId, pageNo = 0, pageSize = 10 } = option

  const ret = await filterStore<NoteMock>(
    TableName.note,
    (d) => d?.tagId === tagId && d?.categoryId === categoryId && !d?.isDeleted,
    pageNo,
    pageSize
  )
  return ret
}

type SaveNote = NoteMock & {
  id?: number
  content?: string
}
export async function saveNote(option: SaveNote) {
  await saveStore<NoteMock>(TableName.note, option, option?.id)
}

export async function deleteNote(ids: number[], isTrue = false) {
  if (isTrue) {
    const ret = await deleteStore(TableName.note, ids)
    return ret
  } else {
    await saveNote({
      id: ids[0],
      isDeleted: true
    })
  }
}

export async function getAllNote() {
  return await getAllStore<NoteMock>(TableName.note)
}

/**
 * supabase api
 */
export async function getNotesAPI(
  option?: Pick<Note, 'category_id' | 'tag_id' | 'note_state' | 'is_deleted' | 'content'>
) {
  let query = supabase.from('note').select('*')

  if (option?.category_id) query = query.eq('category_id', option.category_id)
  if (option?.tag_id) query = query.eq('tag_id', option.tag_id)
  if (option?.note_state) query = query.eq('note_state', option.note_state)
  if (option?.is_deleted) query = query.eq('is_deleted', option.is_deleted)
  query = query.textSearch('content', option?.content || '')

  const { data } = await query
  return data
}
export async function saveNoteAPI(note: Note) {
  if (note?.id) {
    return await supabase.from('note').update(note).eq('id', note.id)
  }
  return await supabase.from('note').insert([note])
}
