import Dexie from 'dexie'
import { MuCategory, Note, TableName, Tag } from '../../model'
import { tagsMock, categoryMock } from '@/mock'
import dayjs from 'dayjs'
const dbName = 'wen_chan_db'

class DataBase extends Dexie {
  [TableName.category]!: Dexie.Table<MuCategory>;
  [TableName.note]!: Dexie.Table<Note>;
  [TableName.tag]!: Dexie.Table<Tag>
  constructor() {
    super(dbName)
    this.version(1).stores({
      [TableName.category]: '++id,title,createTime,updateTime',
      [TableName.note]: '++id,content,categoryId,tagId,isFocused,isDeleted,createTime,updateTime',
      [TableName.tag]: '++id,categoryId,tagId,isFocused,name,charsCount,createTime,updateTime'
    })
  }
}

const db = new DataBase()

function initDB(tableNames?: { name: TableName; data: any[] }[]) {
  tableNames?.forEach(async (d) => {
    const datas = await db.table(d.name).toArray()
    if (datas && datas.length === 0) {
      await db.table(d.name).bulkAdd(d.data)
    }
  })
}
initDB([
  {
    name: TableName.tag,
    data: addCreateTime(tagsMock)
  },
  {
    name: TableName.category,
    data: addCreateTime(categoryMock)
  }
])

function addCreateTime(datas: any[]) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return datas.map((d) => ({ ...d, createTime: now }))
}
export { Dexie, dbName, DataBase, db }
