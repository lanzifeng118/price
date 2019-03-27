import axios from 'axios'

export function myAxios(url, method = 'post') {
  return function(data) {
    return new Promise((resolve, reject) => {
      const params = {
        method,
          url: '/binheng/api' + url
      }
      switch (method) {
        case 'post':
          params.data = data
          break
        default:
          params.params = data
          break
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