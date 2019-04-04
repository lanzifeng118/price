import { post } from '../libs/post'

const URL = '/domestic/change'

export const API_domestic = {
  query: post(URL, 'query'),
  insert: post(URL, 'insert'),
  update: post(URL, 'update'),
  delete: post(URL, 'delete'),
  upload: post('/domestic/upload', 'upload')
}
