import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
    timeout: 8000
  })

  instance.interceptors.request.use(config => {
    return config
  },err => {
    console.log(err)
  })

  instance.interceptors.response.use(result => {
    return result.data
  }, err => {
    console.log(err)
  })

  return instance(config)
}