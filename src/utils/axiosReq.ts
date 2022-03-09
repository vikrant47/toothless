import store from '@/store'
import axios from 'axios'
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus'
import {getToken, setToken} from '@/utils/auth'
import {AxiosConfigTy, AxiosReqTy, ObjTy} from '~/common'

let reqConfig: any
let loadingE: any

const service: any = axios.create()
// 请求拦截
service.interceptors.request.use(
  (request: AxiosReqTy) => {
    // token setting
    // @ts-ignore
    request.headers['Authorization'] = getToken()
    /* download file*/
    if (request.isDownLoadFile) {
      request.responseType = 'blob'
    }
    /* upload file*/
    if (request.isUploadFile) {
      // @ts-ignore
      request.headers['Content-Type'] = 'multipart/form-data'
    }
    reqConfig = request
    if (request.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: '数据载入中',
        // spinner: 'el-icon-ElLoading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }
    /*
     *params会拼接到url上
     * */
    if (request.isParams) {
      request.params = request.data
      request.data = {}
    }
    return request
  },
  (err: any) => {
    Promise.reject(err)
  }
)
// 响应拦截
service.interceptors.response.use(
  (res: any) => {
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    // 如果是下载文件直接返回
    if (reqConfig.isDownLoadFile) {
      return res
    }
    const {flag, message, isNeedUpdateToken, token, statusCode} = res.data
    //更新token保持登录状态
    if (isNeedUpdateToken) {
      setToken(token)
    }
    const successCode = '0,200,20000'
    if (successCode.includes(statusCode)) {
      return res.data
    } else {
      if (statusCode === 401) {
        ElMessageBox.confirm('请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
            //direct return
            return Promise.reject(res.data)
          })
        })
      }
      if (reqConfig.isAlertErrorMsg) {
        ElMessage({
          message: message,
          type: 'error',
          duration: 2 * 1000
        })
      }
      //返回错误信息
      //如果未catch 走unhandledrejection进行收集
      //注：如果没有return 则，会放回到请求方法中.then ,返回的res为 undefined
      return Promise.reject(res.data)
    }
  },
  (err: any) => {
    /*http错误处理，处理跨域，404，401，500*/
    if (loadingE) loadingE.close()
    ElMessage({
      message: err,
      type: 'error',
      duration: 2 * 1000
    })
    //如果是跨域
    //Network Error,cross origin
    const errObj: ObjTy = {
      msg: err.toString(),
      reqUrl: reqConfig.baseURL + reqConfig.url,
      params: reqConfig.isParams ? reqConfig.params : reqConfig.data
    }
    return Promise.reject(JSON.stringify(errObj))
  }
)

export function axiosReq(req: AxiosConfigTy): any {
  return service(Object.assign({}, req, {
    baseURL: req.baseURL ?? import.meta.env.VITE_APP_BASE_URL,
    timeout: req.timeout ?? 15000
  }));
}

export default axiosReq
