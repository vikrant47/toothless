import request from '@/utils/axiosReq'
import {ObjTy} from '~/common'

export function loginReq(data: ObjTy) {
  return request({
    url: '/api/system/auth/login',
    data: {login: data.username, password: data.password},
    method: 'post',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false
  })
}

export function getInfoReq() {
  return request({
    url: '/api/system/auth/user',
    bfLoading: false,
    method: 'get',
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/integration-front/user/loginOut',
    method: 'post'
  })
}
