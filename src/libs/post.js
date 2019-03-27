import axios from 'axios'

export function post(url, method) {
  return function(data) {
    return new Promise((resolve, reject) => {
      const params = {
        method: 'post',
        url: '/binheng/api' + url
      }
      if (method === 'upload') {
        params.headers = { 'content-type': 'multipart/form-data' }
        params.data = data        
      } else if (method){
        params.data = {
          method,
          data
        }
      } else {
        params.data = data
      }
      
      axios(params)
        .then(res => {
          const { code, data, msg } = res.data
          if (code === 200) {
            resolve(data)
          } else {
            reject({ message: msg, code })
          }
        })
        .catch(err => {
          reject({ message: '系统出错了' })
        })
    })
  }
}