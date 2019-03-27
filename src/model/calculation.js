import { post } from '../libs/post'

const URL = '/calculation'
export const API_calculation = {
  query: post(URL, 'query')
}
