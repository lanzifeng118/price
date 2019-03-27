import { post } from '../libs/post'

const URL = '/zone'
export const API_zone = {
  query: post(URL, 'query'),
  insert: post(URL, 'insert'),
  update: post(URL, 'update'),
  delete: post(URL, 'delete')
}
