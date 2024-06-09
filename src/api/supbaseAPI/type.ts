import { Tables, Enums } from './supabase'

export type NoteState = Enums<'note_state'>

export type Note = Tables<'note'>
export type Category = Tables<'category'>
export type Tag = Tables<'tag'>
