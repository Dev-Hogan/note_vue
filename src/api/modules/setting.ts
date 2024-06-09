import { getAllTags } from './tags'
import { getAllNote } from './all'
import { getAllMuCategory } from './menu'
/**近日字符 */
export async function getDayChar() {
  return 1
}
/** 近日问题*/
export async function getDayQuestion() {
  return 1
}

/**获取用户信息,头像等 */
export async function getAccount() {
  return 1
}

/**全局搜索 */
export async function searchAllNotesByName(name?: string) {
  if (!name) return []
  const notes = await getAllNote()
  return notes.filter((n) => n.content?.toLocaleUpperCase().includes(name.toLocaleUpperCase()))
}

/**获取总字符、问题、分类、标签 */
type Statistics = {
  name: string
  count: number
}
export async function getStatistics() {
  const tags = await getAllTags()
  const notes = await getAllNote()
  const categories = await getAllMuCategory()
  const chars: Statistics = {
    name: '总字符',
    count: notes.reduce((p, c) => (p += c.count || 0), 0)
  }
  const question: Statistics = {
    name: '问题',
    count: notes.length
  }
  const category: Statistics = {
    name: '分类',
    count: categories.length
  }
  const tag: Statistics = {
    name: '标签',
    count: tags?.length
  }
  return [chars, question, category, tag]
}

/** 字符变化*/
export async function charsDayChange() {
  return [10, 52, 200, -10, 390, 330, 220]
}

/**问题变化 */

/**字数日历统计 */
