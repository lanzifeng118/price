import { myAxios } from '../libs/myAxios'

export const API_user = {
  logout: myAxios('/logout'),
  login: myAxios('/login')
}
