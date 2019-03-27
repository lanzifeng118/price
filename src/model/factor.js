import { post } from '../libs/post'

const URL = '/factor'
export const API_factor = {
  query: post(URL, 'query'),
  update: post(URL, 'update')
}
