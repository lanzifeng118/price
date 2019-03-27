import { post } from '../libs/post'

const DOMURL = '/domestic/change'
const DOMLOC = '/local/change'

export const API_logistics = {
  // 国内小包
  domestic: {
    query: post(DOMURL, 'query'),
    insert: post(DOMURL, 'insert'),
    update: post(DOMURL, 'update'),
    delete: post(DOMURL, 'delete')
  },
  // 当地配送
  local: {
    query: post(DOMLOC, 'query'),
    insert: post(DOMLOC, 'insert'),
    update: post(DOMLOC, 'update'),
    delete: post(DOMLOC, 'delete')
  }
}
