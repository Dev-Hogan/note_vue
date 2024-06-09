import { supabase } from '../supbaseAPI/base'
import { TableName } from '@/models'

export async function getAllTag() {
  return await supabase.from(TableName.category).select()
}
