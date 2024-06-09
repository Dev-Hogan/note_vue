export interface Note {
  id?: number
  content?: string
  categoryId?: number
  tagId?: number
  isFocused?: boolean
  isDeleted?: boolean
  isWaiting?: boolean
  createTime?: string
  updateTime?: string
  count?: number
}
