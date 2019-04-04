import { post } from '../libs/post'

const DOMLOC = '/local/change'

export const API_Local = {
  query: post(DOMLOC, 'query'),
  insert: post(DOMLOC, 'insert'),
  update: post(DOMLOC, 'update'),
  delete: post(DOMLOC, 'delete'),
  upload: post('/local/upload', 'upload'),
  downloadUrl: '/local/download'
}
